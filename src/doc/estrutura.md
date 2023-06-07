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

