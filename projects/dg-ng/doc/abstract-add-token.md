## AbstractAddToken

O interceptor AddToken servicrá (como o próprio nome diz) para inserir dinamicamente o token na aplicação, 
nos livrando da necessidade de inseri-lo a cada requisição.

A renovação do token também será realizada automaticamente após o reconhecimento do token expirado. Para isso, o 
AddToken utilizará as informações de renovação contidas em AbstractTokenService.

### Inicio rápido

````shell
ng g interceptor core/interceptors/add-token/add-token
````

````ts
@NgModule({
  declarations: [],
  imports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export


class AppModule { }
````

#### Classe AbstractAddToken na íntegra para estudo e subscrições
````ts
export abstract class AbstractAddToken {

  // lista de ROTAS aos quais o token não deve ser inserido
  public listRouterExcepAddToken: string[] = [];
  // lista de endereços de ENDPOINTS aos quais o token não deve ser inserido
  public listUrlExcepAddToken: string[] = [];
  // controlador de estado, verifica se a renovação está em andamento
  public isRefreshing = false;
  // Observable contendo valor da renovação
  public refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  // nome do header na requisição
  public name_headerToken = 'Authorization';
  // adicionar 'Bearer' como prefixo do token
  public addBearer: boolean = true;
  // Bearer
  public bearer = 'Bearer ';

  protected constructor(
    public _token: AbstractTokenService<any>
  ) {
  }
  /**
   * Metodo para adicionar token após a renovação
   * @param request
   * @param token
   * @param name
   */
  public static addTokenHeader(request: HttpRequest<any>, token: string, name: string) {
    return request.clone({ headers: request.headers.set(name, token) });
  }

  /**
   * verifica se a URL atual faz parte da lista de URL que não deve ser inserido o token
   */
  exceptRouter(): boolean {
    const currentUrl = window.location.pathname.split('/');
    return this.listRouterExcepAddToken.findIndex(context => context == currentUrl.join('/')) != -1;
  }

  /**
   * verifica se a URL atual faz parte da lista de URL que não deve ser inserido o token
   */
  exceptUrl(endpoint: string): boolean {
    return this.listUrlExcepAddToken.findIndex(context => context == endpoint) != -1;
  }

  /**
   * Metodo de refresh token
   * @param request
   * @param next
   * @private
   */
  public handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      // iniciando processo de renovação de token
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      // buscando token atual
      const token = this._token.getToken();

      // renovar token somente caso o mesmo existe
      if (token)
        return this._token.refreshToken().pipe(
          switchMap((resp: any) => {
            this.isRefreshing = false;

            const token = this.pipeRequestRefreshToken(resp)

            this._token.saveToken(token);
            this.refreshTokenSubject.next(token);
            return next.handle(
              AbstractAddToken.addTokenHeader(request, (this.addBearer ? this.bearer : '') + token, this.name_headerToken)
            );
          }),
          catchError((err) => {
            this.isRefreshing = false;

            window.dispatchEvent( new CustomEvent('sistem-logout') )
            return throwError(err);
          })
        );
    }

    // após renovação do token, é retornado o requeste para uma nova tentativa
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(
        AbstractAddToken.addTokenHeader(request, (this.addBearer ? this.bearer : '') + token, this.name_headerToken))
      )
    );
  }

  public rootIntercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = request;
    const token = this._token.getToken();

    const urlPesquisaAnonima = window.location.pathname.split('/');
    urlPesquisaAnonima.pop();

    if (this.exceptRouter() || this.exceptUrl(request.url)) {
      return next.handle(request)
    }

    request = request.clone({
      setHeaders: {[this.name_headerToken]: (this.addBearer ? this.bearer : '') + token}
    });

    // @ts-ignore
    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
          if (!this._token.checkExp()) {
            return this.handle401Error(authReq, next);
          }
        }

        return throwError(error);
      })
    );

    // return next.handle(request);
  }

  abstract pipeRequestRefreshToken(resp: any): string
}
````


