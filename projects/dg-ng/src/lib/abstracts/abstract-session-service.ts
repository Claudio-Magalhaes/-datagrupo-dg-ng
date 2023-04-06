import {AbstractTokenService} from "../token/abstract-token.service";
import {HostListener, Injectable} from "@angular/core";

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

  /**
   * @deprecated
   * Metodo ainda não finalizado
   * @param name
   * @param localStorageName
   */
  issetAttr(name: string, localStorageName?:string): boolean {
    if (name in this) {
      // @ts-ignore
      return !!this[name]
    }

    const item = JSON.parse(String(window.localStorage.getItem((localStorageName || name))));

    return !!item;
  }

  /**
   * @deprecated
   * Metodo ainda não finalizado
   * @param name
   * @param localStorageName
   */
  getAttr(name: string, localStorageName?:string):any {
    if (this.issetAttr(name)) {
      if (name in this) {

        // @ts-ignore
        if (!!this[name]) return this[name];
      }

      // @ts-ignore
      this[name] = JSON.parse(String(window.localStorage.getItem((localStorageName || name))))

      // @ts-ignore
      return this[name]
    }

    return false
  }

  /**
   * @deprecated
   * Metodo ainda não finalizado
   * @param data
   * @param name
   * @param localStorageName
   */
  setAttr(data: any, name: string, localStorageName?:string):void {
    // @ts-ignore
    this[name] = data;
    window.localStorage.setItem((localStorageName || name), JSON.stringify(data))
  }

  /**
   * @deprecated
   * Metodo ainda não implementado
   * @param name
   * @param localStorageName
   */
  removeAttr(name: string, localStorageName?:string) {}
}

