import {HostListener, Injectable} from "@angular/core";
import {AbstractTokenService} from "./abstract-token.service";

abstract class abstractUserSessionEntity {}

@Injectable({
  providedIn: 'root'
})
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

  //TODO criar metodos de 'crud' de attr dinamicos

  //***********************************************************
  //*************** COLEÇÕES DE DADOS DINAMICOS ***************
  // As coleções de dados (atributos) que são informações necessárias na SessionService
  // para não ser necessário criar metodos para salvar cada atributo e depois recolhe-los também
  // individualmente nas SESSIONGUARD, esses metodos abaixo foram criados

  /**
   * Metodo responsável para salvar os dados na LOCALSTORAGE
   * Esse metodo não é obrigatório, pois realiza apenas um "setItem",
   * mas foi criado para manter a coerencia dos metodos
   * @param data
   * @param localStorageName
   */
  saveAttr(data: any, localStorageName:string):void {
    window.localStorage.setItem((localStorageName), JSON.stringify(data))
  }

  /**
   * Metodo verifica se a coleção de dados existe na intancia ou no LOCALSTORAGE
   * @param name
   * @param localStorageName
   */
  issetAttr(name: string, localStorageName?:string): boolean {
    if (name in this) {
      // @ts-ignore
      return !!this[name]
    }

    let attr = window.localStorage.getItem((localStorageName || name));

    return !!attr;
  }

  /**
   * Metodo retorna os dados da coleção de dados desejada, caso os dados existam apenas
   * no LOCALSTORAGE, esse metodo irá salvar os dados na instancia para agilizar as próximas
   * buscas
   * @param name
   * @param localStorageName
   */
  getAttr<T>(name: string, localStorageName?:string): any | T {
    if (this.issetAttr(name)) {
      if (name in this) {

        // @ts-ignore
        if (!!this[name]) return this[name];
      }

      let attr = window.localStorage.getItem((localStorageName || name));

      if (!!attr) {
        attr = JSON.parse(String(attr));

        // salvando dados reconlhidos na instância para melhorar o desempenho do sistema
        // @ts-ignore
        this[name] = attr;

        return attr;
      }
    }

    return false
  }

  /**
   * Metodo forçar uma nova busca nos LOCALSTORAGE da coleção informada e atualizar
   * o seu atributo correspondente
   * @param name
   * @param localStorageName
   */
  popular(name: string, localStorageName?:string):void {
    const attr = this.getAttr(name, localStorageName)

    if (attr != null) {
      // @ts-ignore
      this[name] = attr;
    }
  }

  /**
   * Metodo para remover a coleção de dados
   * @param name
   * @param removeInstance
   * @param localStorageName
   */
  removeAttr(name: string, removeInstance: boolean = true, localStorageName?:string) {
    window.localStorage.setItem((localStorageName || name), '');
    window.localStorage.removeItem((localStorageName || name));

    if (removeInstance && (name in this)) {
      // @ts-ignore
      this[name] = undefined;
    }
  }
}

