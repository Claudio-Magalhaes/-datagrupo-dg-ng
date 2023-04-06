## Guardas de rota (Guards)

Serão necessárias pelo menos 3 guardas de rotas para termos uma boa fluides. Sendo essas; 


| Guards de:    | Nome da classe      | Função                                                                                                  |
|---------------|---------------------|---------------------------------------------------------------------------------------------------------|
| Login         | login.guard         | Inpedir um usuário logado de acessar a tela de login                                                    |
| session       | session.guard       | Restringir área interna da aplicação aos usuários logados                                               |
| start-session | start-session.guard | Iniciar o login do usuário, realizando a transição do estado *publibo* para *logado* de maneira segura. |

Depois de muito pensar, chego a conclusão que as guardas são simples de mais para serem abstraídas, porem muito importantes para não serem consideradas
na estrutura. Por isso irei mostrar como criar e costumizar as principais funções em cada guarda.

### criando rotas

Aqui considero que você está usando a estrutura padrão de projetos *Angular* desenvolvido para a Datagrupo. 
Caso esteja utilizando outra estrutura, altere o *path* (*"core/guards"*) informado nos scriptis abaixo

````shell
ng g guard core/guards/login/login
ng g guard core/guards/start-session/start-session
ng g guard core/guards/session/session
````

Em todos os casos, recebera uma pergunta parecida com a apresentada aqui abaixo.
Selecione <b>CanActivate</b> exatamente como no exemplo abaixo

````shell
? Which interfaces would you like to implement? (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
>(*) CanActivate                                                                                                                             
 ( ) CanActivateChild                                                                                                                        
 ( ) CanDeactivate                                                                                                                           
 ( ) CanLoad 
````
 Isso irá criar as guardas parecidas com a abaixo (mudando apenas o nome).

````ts
@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  
}
````
É hora de criar os seus próprios verificadores.

#### LoginGuard

Neste caso apenas copiar e colar o conteúdo da classe será o suficiente

````ts
@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private token: TokenService,
    private router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.token.issetToken()) {
      if (this.token.checkExp()) {
        this.router.navigate(['user/'])
      } else {
        this.token.clearToken();
      }
    }
    
    return true;
  }

}
````

#### StartSessionGuard

Neste caso, realizo as "**minhas**" validações. No seu projeto os atributos podem ter nomes diferentes.
Para isso altere a verificação informada no código.

Você pode criar as suas próprias validações, mas lembre-se que nesse momento o usuário tem apenas o que
recebeu no login, que costuma ser apenas os tokens.

Use essa verificação para garantir que o token é válido, que a sua composição está correta, e em seguida 
importe as imformações do token para a instância atual da aplicação usando o *this.session.setUser()*

[//]: # (TODO adicionar link da doc de session)
[Para mais informações sobre a classe session clique aqui]()

````ts
@Injectable({
  providedIn: 'root'
})
export class StartSessionGuard implements CanActivate {
  constructor(
    private session: SessionService,
    private token: TokenService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.token.issetToken()) {
      this.session.logout();
    }

    if (!this.token.checkExp()) {
      this.session.logout();
    }

    return true;
  }

}
````

#### SessionGuard

Mais uma vez, as validações apresentadas aqui são de EXEMPLO. Mas representam cenários reais.

Nesta guarda devemos verificar todos os dados necessários para garantir a integridade do usuário logado, mas também podemos garantir que dados básicos 
necessários para a abertura do sistema sejam validados.

````ts

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate {
  constructor(
    private session: SessionService,
    private token: TokenService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.token.issetToken()) {
      this.session.logout();
    }

    if (!this.token.checkExp()) {
      this.session.logout();
    }

    // ALTERE ESSA VERIFICAÇÃO PARA SERVIR A SUA APLICAÇÃO
    if (!this.session.issetAttr('appMenu')) {
      this.router.navigate(['auth/start-session']).then()
    } else {
      if (!this.session?.appMenu) {
        this.session.getAttr('appMenu')
      }
    }

    return true;
  }
}
````

[//]: # (TODO adicionar documentação de exceção de rotas)
[//]: # (##### Criando rotas internas sem validação de token)
