## AbstractTokenService

Classe abstrata que responsável por gerir o token JWT da aplicação
### Início rápido

Para utilizar no modo padrão, basta criar uma interface para sinalizar os dados trafegados
e alimentar o <i>path_refreshToken</i> que serve para informar o caminho de busca para renovação do token.
````ts
interface SUA_INTERFACE_DE_TOKEN {
  perfil?: string,
  exp?: number,
  user?: string
}

@Injectable({
  providedIn: 'root'
})
export class TokenService extends AbstractTokenService<SUA_INTERFACE_DE_TOKEN> {
  path_refreshToken = '';
  
  constructor(private http: HttpClient) {
    super(http);
  }
}
````
### Atributos
Os atributos abaixo irão determinar como a classe salvará e/ou enviará o token e o refreshToken

| Atribudo                       | tipo    | Valor padrão    | Descrição                                                                             |
|--------------------------------|---------|-----------------|---------------------------------------------------------------------------------------|
| path_refreshToken              | string  | ''              | Endereço de renovação do token                                                        |
| http_refreshToken              | boolean | true            |                                                                                       |
| name_headerToken_refresh       | string  | 'Authorization' | Nome do HEADER da reuisição http que conterá o token re denovação                     |
| name_localStoragy_token        | string  | 'accessToken'   | Nome do TOKEN no localStoragy                                                         |
| name_localStoragy_refreshToken | string  | 'refreshToken'  | Nome do TOKEN DE RENOVAÇÃO no localStoragy                                            |
| addBearer                      | boolean | true            | Determina se será ou não incluído o 'Bearer' na requisição derenovação                |
| bearer                         | string  | 'Bearer '       | texto contido no bearer                                                               |
| expAttributeToken              | string  | 'exp'           | Nome do atributo interno do token que representa a data de expiração do próprio token |

<hr>

### Metodos

Esses serão os metodos disponíveis

#### getToken(): string

Metodo que retorna o token como está salvo no localStoragy (string)

<hr>

#### getRefreshToken(): string

Metodo que retorna o refresh token como está salvo no localStoragy (string)

<hr>

#### openToken(token?: string): TOKEN

Metodo para abrir o token, (o transformando de <i>string</i> <i>object</i>). Recebe um parâmetro de string para abrir tokens externos, 
porem se nenhum valor for passado buscará do metodo <i>getToken()</i>

| Atribudo           | tipo    | Valor padrão             | Descrição                     |
|--------------------|---------|--------------------------|-------------------------------|
| token              | string  | <i>getToken()</i>        | Token externo para ser aberto |

<hr>

#### public checkExp(token?: string | any, expAttributeToken?: string): boolean

Metodo responsável por verificar a data de um token, seja ele o da própria aplicação ou algum informado externamente


| Atribudo           | tipo    | Valor padrão             | Descrição                                   |
|--------------------|---------|--------------------------|---------------------------------------------|
| token              | string  | <i>getToken()</i>        | Token que será inspecionado                 |
| expAttributeToken  | string  | <i>expAttributeToken</i> | atributo interno do token que será validado |

<hr>

#### refreshToken(): Observable<any>

Metodo de renovação de token. Somente para o token da aplicação.
Alimente os atributos da classe (<i>Abstract-token-service</i>) para definir parâmetros de busca diferentes

<hr>

#### public saveToken(token: string, refreshToken?: string): void

Metodo de salvamento do token

| Atribudo     | tipo    | Valor padrão | Descrição                                |
|--------------|---------|--------------|------------------------------------------|
| token        | string  | NENHUM       | Token da aplicação                       |
| refreshToken | string  | NENHUM       | Token de renovação do token da aplicação |

<hr>


#### public clearToken(): void

Metodo de exclusão do token

<hr>

#### Classe AbstractTokenService na íntegra para estudo e subscrições

````ts
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

export abstract class AbstractTokenService<TOKEN extends object> {
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

  public getToken(): string {
    return window.localStorage.getItem(this.name_localStoragy_token) || '';
  }

  refreshToken(): Observable<any> {
    return this._http.post(this.path_refreshToken, {
      refreshToken: String(window.localStorage.getItem(this.name_localStoragy_refreshToken))
    }, {
      headers: {
        [this.name_headerToken_refresh]: (this.addBearer ? this.bearer : '') + this.getToken()
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

````
