## AbstractSessionService

Essa classe foi idealizada para ser a sua classe de instância central da aplicação. Nela serão guardados os valores 
necessários para o bom funcionamento da aplicação. (nome, id, perfil...). <br/>

Os dados salvos no *localStorage* serão por meio das *guardas* e/ou da tela *start-session* salvos nessa classe. 
Isso garantira um aceso centralizado as informações, bem como garantir a integridade dos dados e velocidade de resposta.

Pensando nisso, todos os metodos e atributos contidos nessa classe deve ser de natureza global a aplicação.


### Início rápido
Para iniciarmos essa classe precisaremos informar o atributo user, pois ele será o principal receptor dos dados do token,
provendo essas informações a toda a aplicação.
Os dados informados *UserAppEntity* são apenas para fins de exibição

````ts
class UserAppEntity {
  id?: number | string;
  perfil?: tipoPerfil;
}

declare type tipoPerfil = 'ADMIN' | 'CLIENTE' | 'FUNCIONARIO';

@Injectable({
  providedIn: 'root'
})
export class SessionService extends AbstractSessionService {

  user: UserAppEntity = {};

  constructor(public token: TokenService) {
    super(token)
  }

  setUser(): void {
    let token = this.token.abrirToken();
    this.user.id = token.sub;
    this.user.perfil = token.perfil;
  }
}
````

### Atributos

| Atribudo              | tipo             | Valor padrão           | Descrição                                      |
|-----------------------|------------------|------------------------|------------------------------------------------|
| user                  | classe/interface | {}                     | Objeto com principais dados do usuario         |
| pathRedirectLogout    | string           | window.location.origin | Link de redirecionamento após *logout*         |
| perfilAttributeToken  | string           | 'perfil'               | Atributo do token contem a informação do peril |

<hr/>

## Métodos

#### abstract setUser():void

Método para montar o atributo *user*.

<hr/>

#### checkPerfil(perfil: string | string[], perfilAttributeToken?: string):boolean

Método para verificar o perfil do usuário. Use-o sempre que desejar permitir algo apenas a determinados perfis

| Atribudo             | tipo            | Valor padrão               | Descrição                                          |
|----------------------|-----------------|----------------------------|----------------------------------------------------|
| perfil               | string/string[] | undefined                  | Perfis aceitos para para essa validação            |
| perfilAttributeToken | string          | this.perfilAttributeToken  | Nome do atributo que deve conter o valor de perfil |

<hr/>

#### public logout(): void

Use esse metodo em qualquer lugar do sistema para realizar o *logout*, seja por importação ou por evento. Exemplo abaixo

````ts
import {EventEmitter} from "@angular/core";

window.dispatchEvent(new EventEmitter('sistem-logout'))
````

<hr/>

#### Classe AbstractSessionService na íntegra para estudo e subscrições

````ts
export abstract class AbstractSessionService {
    
  abstract user: abstractUserSessionEntity;
  public pathRedirectLogout = window.location.origin
  public perfilAttributeToken = 'perfil'

  protected constructor(
    public Token: AbstractTokenService<any>
  ) {}

  abstract setUser():void;

  @HostListener('window:sistem-logout', ['$event'])
  public logout(): void {
    this.Token.clearToken();
    window.localStorage.clear();
    window.location.href = this.pathRedirectLogout;
  }

  checkPerfil(perfil: string | string[], perfilAttributeToken?: string):boolean {
    if (!!perfilAttributeToken) {
      if (!(perfilAttributeToken in this.user)) return false;
    } else {
      if (!(this.perfilAttributeToken in this.user)) return false;
    }

    if (typeof perfil === 'string') {
      // @ts-ignore
      return this.user[perfilAttributeToken] === perfil

    } else if (Array.isArray(perfil)) {
      // @ts-ignore
      return perfil.findIndex(perfil => perfil === this.user[perfilAttributeToken]) !== -1
    }

    return false
  }
}
````
