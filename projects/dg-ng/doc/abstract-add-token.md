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


