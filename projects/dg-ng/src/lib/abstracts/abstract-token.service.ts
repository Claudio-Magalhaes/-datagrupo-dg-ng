import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

export abstract class AbstractTokenService<TOKEN extends object> {
  /**
   * @abstract endereço do servidor
   */
    // contexto da url de refresh
  public abstract path_refreshToken: string;
  // contexto da url de refresh
  public name_headerToken_refresh = 'Authorization';
  // nome to token no localStoragy
  public name_localStoragy_token = 'accessToken';
  // nome to token de refresh no localStoragy
  public name_localStoragy_refreshToken = 'refreshToken';
  // adicionar 'Bearer' como prefixo do token
  public addBearer: boolean = true;
  // Bearer
  public bearer = 'Bearer ';
  // atributo de verificação de expiração do tokem
  public expAttributeToken = 'exp';
  public http_refreshToken: boolean = true;

  protected constructor(private _http: any | HttpClient = HttpClient) {}

  public issetToken() {
    const token = window.localStorage.getItem(this.name_localStoragy_token);
    return !!token && token != 'null' && token != 'undefined';
  }

  public getToken(): string {
    return window.localStorage.getItem(this.name_localStoragy_token) || '';
  }

  public abrirToken(token?: string): TOKEN {
    if (!token) {
      token = String(window.localStorage.getItem(this.name_localStoragy_token));
    }

    if (!token || token == "null") {
      return <TOKEN>{};
    }

    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  public checkExp(token?: string | any, expAttributeToken?: string):boolean {

    if (!token) {
      token = this.abrirToken();
    }

    if (!((expAttributeToken || this.expAttributeToken) in token)) {
      return false;
    }

    const resultExp = token[this.expAttributeToken] * 1000;

    return resultExp > new Date().getTime();
  }

  public getRefreshToken(): string {
    return window.localStorage.getItem(this.name_localStoragy_refreshToken) || '';
  }

  refreshToken(): Observable<any> {
    return this._http.post(this.path_refreshToken, {
      refreshToken: String(window.localStorage.getItem(this.name_localStoragy_refreshToken))
    }, {
      headers: {
        [this.name_headerToken_refresh]: (this.addBearer ? this.bearer : '') + this.getRefreshToken()
      }
    });
  }

  public saveToken(token: string, refreshToken?: string): void {
    window.localStorage.removeItem(this.name_localStoragy_token);
    window.localStorage.setItem(this.name_localStoragy_token, token);

    if (!!refreshToken) {
      window.localStorage.removeItem(this.name_localStoragy_refreshToken);
      window.localStorage.setItem(this.name_localStoragy_refreshToken, refreshToken);
    }
  }

  public clearToken(): void {
    window.localStorage.setItem(this.name_localStoragy_token, '-');
    window.localStorage.setItem(this.name_localStoragy_refreshToken, '-');
    window.localStorage.removeItem(this.name_localStoragy_token);
    window.localStorage.removeItem(this.name_localStoragy_refreshToken);
  }

}
