# Iniciando projeto ng

* [Iniciando angular](#inciando-angular)
* [Criando ambientes](#criando-ambientes)
* [Instalando bibliotecas](#criando-ambientes)

[//]: # (* [Criando estrutura SCSS]&#40;#criando-estrutura-scss&#41;)

Aqui iremos ver o básico para iniciar o projeto contemplando os seus amientes de desenvolvimento, tipo

<hr>

## Iníciando angular

Iremos iniciar o angular da maneira convencional, utilizando o [Angular CLI](https://github.com/angular/angular-cli).
[Possíveis problemas por diferentes versões do angular](possiveis-problemas.md#possveis-problemas-por-diferentes-verses-do-angular)

````shell
ng new projeto-base
````

Aceite o roteamento

````shell
? Would you like to add Angular routing? (y/N) y
````

quando perguntado sobre qual estrutura css usar, selecione SCSS

````shell
? Which stylesheet format would you like to use? (Use arrow keys)
  CSS
> SCSS   [ https://sass-lang.com/documentation/syntax#scss                ]
  Sass   [ https://sass-lang.com/documentation/syntax#the-indented-syntax ]
  Less   [ http://lesscss.org ]
````
Pronto! podemos começar.

<hr>

## Criando ambientes

O angular já vem por natureza com 2 ambientes, '*development*' e '*production*' aos quais consomem os arquivos
'*enviroment.ts*' e '*enviroment.prod.ts*' respectivamente. <br>
Nós iremos adicionar mais 3 ambientes, '*local*', '*test*' e '*homolog*' para consumir os arquivos '*enviroment.local.ts*', '*enviroment.test.ts*'
e '*enviroment.homolog.ts*' respectivamente. <br>

| ambiente    | arquivo                     | descrição                                                                                                                              |
|-------------|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| development | enviroment.ts               | Arquivo base. Serve como modelo de dados, mas seus dados não serão utilizados                                                          |
| local       | enviroment.local.ts         | Seu ambiente de desenvolvimento                                                                                                        |
| test        | enviroment.test.ts          | Ambiente de teste                                                                                                                      |
| homolog     | enviroment.homolog.ts       | Ambiente de homologação                                                                                                                |
| production  | enviroment.prod.ts          | Produção                                                                                                                               |
| --          | enviroment.local.exemplo.ts | Facilite a vida do desenvolvedor adicionando uma cola do ambiente, ela não terá utilizade prática porem servirá para novas instalações |
 
Os ambientes são geridos pelo *angular.json* (existente na raiz do seu projeto), abra-o e veremos uma estrutura similar uma apresentada abaixo.<br>
*todos os valores não utilizados foram removidos, restando apenas a estrutura que leva aos embientes*

````json
{
  "projects": {
    "projeto-base": {
      "architect": {
        "build": {
          "configurations": {
            "production": {},
            "development": {}
          },
          "defaultConfiguration": "local"
        }
      }
    }
  }
}
````

Acima é possível ver que os ambientes antes mencionados estão presentes em '*configurations*', e também que o "*defaultConfiguration*" (build padrão) é o "production",
mude para "local" e dentro de '*configurations*' adicione os objetos abaixo.

````json

"local": {
  "buildOptimizer": false,
  "optimization": false,
  "vendorChunk": true,
  "extractLicenses": false,
  "sourceMap": true,
  "namedChunks": true,
  "fileReplacements": [{
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.local.ts"
  }]
},
"test": {
  "buildOptimizer": false,
  "optimization": false,
  "vendorChunk": true,
  "extractLicenses": false,
  "sourceMap": true,
  "namedChunks": true,
  "fileReplacements": [{
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.test.ts"
  }]
},
"homolog": {
  "buildOptimizer": false,
  "optimization": false,
  "vendorChunk": true,
  "extractLicenses": false,
  "sourceMap": true,
  "namedChunks": true,
  "fileReplacements": [{
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.homolog.ts"
  }]
}
````

Após isso, basta criar os arquivos '*enviroment.local.ts*', '*enviroment.test.ts*' e '*enviroment.homolog.ts*' copiando e colando o próprio arquivo
'*enviroment.ts*' e alterando os seus nomes.

<b>!! IMPORTANTE !!</b> <br>
É necessário ignorar o '*enviroment.local.ts*' no seu '*.gitignore*', pois cada '*clone do git*' estará apontando para o seu back-end (no seu próprio computador) 
e isso geraria comflitos intermináveis.

````gitignore
src/environments/environment.local.ts
````

<hr>

## Instalando bibliotecas

#### bootstrap

````shell
npm i bootstrap
````

O boostrap usa como dependencia principal desde a versão 5 o "*@popperjs/core*", então será necessário instala-lo também.

````shell
npm i @popperjs/core
````

Após ambas as instalações, está na hora de importar essas bibliotecas para a inicialização do angula. Vá até o "*angular.json*" 
e adicionar as linhas apresentadas abaixo.

````json
{
  "projects": {
    "projeto-base": {
     
      "architect": {
        "build": {
          "options": {
            "styles": [
              "src/styles.scss"
            ],
            "scripts": [
              "./node_modules/@popperjs/core/dist/umd/popper.min.js",
              "./node_modules/bootstrap/dist/js/bootstrap.min.js"
            ]
          }
        }
      }
    }
  }
}
````

Existem duas formas de importar os estilos do bootstrap. Uma é importando pelo "*angular.json*", essa funciona bem para quando não 
existem muitas modificações do nosso projeto ao bootstrap. Outra é importalo no "*styles.scss*", essa servirá melhor as nossas necessidades.
O motivo de escolhermos a segunda forma é que normalmente em nossas aplicações, provemos pequenas alterações em classes do bootstrap, e isso funciona
melhor quando a inportação é feita dessa forma

Importação via "styles.scss"
````scss
@import "../node_modules/bootstrap/scss/bootstrap";
````

Importação via "*angular.json*"
````json
{
  "projects": {
    "projeto-base": {
     
      "architect": {
        "build": {
          "options": {
            "styles": [
              "src/styles.scss",
              "./node_modules/bootstrap/scss/bootstrap.scss"
            ]
          }
        }
      }
    }
  }
}
````



<hr>

## Criando estrutura SCSS

Aqui irei aqui apenas descrever as informações básicas
e como proceder para criar uma estrutura de estilo organizada.

Maiores informações sobre 'como' e 'por que' em [estruturando estilo SCSS](estruturando-estilo.md).

Nós utilizaremos uma estrutura similar a utilizada para fazer *themes* em sistemas customizáveis ou layouts 
vendidos prontos. Com isso quero dizer que a nossa estrutura será dividida em responsabilidades, e, importados em
um *arquivo central* que o redistribuirá pelo sistema. 

<b>!! IMPORTANTE !!</b> <br>
Somente o arquivo principal de scss da aplicação deve ser escrito sem o uso do prefixo " _ ". O *preprocessor* do [SASS](https://sass-lang.com/)
compreende que o arquivo sem " _ " corresponde ao arquivo de entrada, por isso ter mais de um arquivo assim geraria erro na transpilação <b>scss > css</b>.

Crie a estrutura apresentada abaixo

<pre>
├── app
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
└── styles.scss
</pre>

Será necessário passar pela [instalação do bootstrap](#bootstrap) para prosseguir.

#### Arquivo de estilo principal (styles.scss)

No seu arquivo principal, crie as importações como apresentado abaixo

````scss
@import "./assets/scss/bootstrap-overwrite";
@import "../node_modules/bootstrap/scss/bootstrap";
@import "./assets/scss/variables";
@import "./assets/scss/typography";
@import "./assets/scss/util";
@import "./assets/scss/components/inputs";
@import "./assets/scss/components/buttons";
@import "./assets/scss/components/tables";
````

#### Bootstrap overwrite
User esse arquivo para alterar as propriedades do bootstrap. Abaixo irei mostrar como alterar a paleta de cores do 
boostrap. Isso lhe proporcionará usar o boostrap com a paleta de cores do projeto atual.

Perceba que colocamos o '*_variables*' acima do '*bootstrap*' isso por que queremos que as nossas variáveis de cor
subscrevam as do bootstrap facilitando a estilização.



<hr>

#### _variables.scss

Como sugere o nome, aqui são guardadas as variaveis scss para uso em toda a aplicação. Fique a vontade para criar
as suas próprias variáveis.

````scss


// ALTERANDO CORES BASICAR DO BOOTSTAP
// scss-docs-start color-variables
$white: white !default;
$blue: #0d6efd !default;
$indigo: #6610f2 !default;
$purple: #6f42c1 !default;
$pink: #d63384 !default;
$red: #dc3545 !default;
$orange: #fd7e14 !default;
$yellow: #ffc107 !default;
$green: $colors-verde-claro !default;
$teal: #20c997 !default;
$cyan: #0dcaf0 !default;
$black: black !default;;

$arrayColors: (
  'white': $white,
  "blue": #0d6efd,
  "indigo": #6610f2,
  "purple": #6f42c1,
  "pink": #d63384,
  "red": #dc3545,
  "orange": #fd7e14,
  "yellow": #ffc107,
  "green-dark": $colors-verde-escuro,
  "green-medio": $colors-verde-medio,
  "green": $colors-verde-claro,
  "teal": #20c997,
  "cyan": #0dcaf0,
  "black": $black,
  "grey": grey
);
````

