# DG-NG

<b>Documentação privada</b>
<br>

Essa bilioteca serve para guardar a arquitetura central de projetos, padronizando fluxos e fornecendo funções uteis para
a criação de um projeto angular. Fluxos e funções contidas nessa lib.

### Iniciando projeto

* [Iniciando projeto](./src/doc/iniciando-projeto.md)
* [Iniciando angular](./src/doc/iniciando-projeto.md#inciando-angular)
* [Criando ambientes](./src/doc/iniciando-projeto.md#criando-ambientes)
* [Instalando bibliotecas](./src/doc/iniciando-projeto.md#criando-ambientes)
* [Criando estrutura SCSS](./src/doc/iniciando-projeto.md#criando-estrutura-scss)
  * [Subscrevendo cores bootstrap]()

Bicblioteca pensada para agrupar classes estruturais de projetos angular.

## Criando arquivos

* [session service](./projects/dg-ng/doc/abstract-session-service.md)<br>
  Essa classe foi idealizada para ser a sua classe de instância central da aplicação. Nela serão guardados os valores
  necessários para o bom funcionamento da aplicação. (nome, id, perfil...).

* [interceptors](./projects/dg-ng/doc/abstract-add-token.md)<br>
  O interceptor AddToken servicrá (como o próprio nome diz) para inserir dinamicamente o token na aplicação, nos
  livrando da necessidade de inseri-lo a cada requisição. Essa classe também consegue identificar a expiração do token e
  notificar ao TokenService para que o mesmo realize a renovação.

* [token](./projects/dg-ng/doc/abstract-token-service.md)<br>
  Classe abstrata que responsável por gerir o token JWT da aplicação. Essa classe também cuidará da renovação do token
  quando necessário

* [Guards](./projects/dg-ng/doc/guards.md)<br>
  As guardas não foram abstraídas pois a sua composição é simples e não vi vantagens em faze-lo. porem, deixo aqui uma
  documentação de como utilizar os metodos já existentes para criar uma GUARD.

## Estrutura

Para facilitar a leitura mantive apenas os arquivos que comtem alguma relevancia para a compreensão da estrutura.

<pre>
├── app
│   ├── core
│   │   ├── config
│   │   │   └── endpoints
│   │   │       └── index.ts
│   │   ├── directives
│   │   ├── guards
│   │   │   ├── login
│   │   │   │    └── login.guard.ts
│   │   │   ├── start-session
│   │   │   │    └── start-session.guard.ts
│   │   │   └── session
│   │   │        └── session.guard.ts
│   │   └── interceptors
│   │       └── add-token
│   │            └── add-token.interceptor.ts
│   ├── helpers
│   ├── layoust 
│   │   ├── public
│   │   │   ├── user.module.ts
│   │   │   └── private-routing.module.ts
│   │   └── private
│   │       ├── private.module.ts
│   │       └── private-routing.module.ts
│   ├── pages 
│   │   ├── auth
│   │   │   └── auth.module.ts
│   │   ├── private
│   │   │   ├── private.module.ts
│   │   │   └── private-routing.module.ts
│   │   └── public
│   │       ├── public.module.ts
│   │       └── public-routing.module.ts
│   ├── services
│   │   └── http-service
│   │       └── http.service.ts
│   └── shared
│   │   └── componets
│   ├── app.component.html
│   ├── app.component.scss
│   ├── app.component.ts
│   ├── app.module.ts
│   └── app-routing.module.ts
├── assets
│   ├── fonts
│   ├── img
│   └── scss
│       ├── components
│       │   ├── _bottuns.scss
│       │   ├── _inputs.scss
│       │   └── _table.scss
│       ├── _bootstrap-overwrite.scss
│       ├── _mixin.scss
│       ├── _typography.scss
│       ├── _util.scss
│       └── _variables.scss
├── enviroment
└── styles.scss
</pre>

