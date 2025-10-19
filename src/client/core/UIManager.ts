/**
 * Clase base para manejar interacciones comunes de UI
 */
export class UIManager {
  /**
   * Obtener un elemento del DOM de forma segura
   */
  protected getElement<T extends HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
  }

  /**
   * Obtener un elemento del DOM (lanza error si no existe)
   */
  protected requireElement<T extends HTMLElement>(id: string): T {
    const element = this.getElement<T>(id);
    if (!element) {
      throw new Error(`Elemento requerido no encontrado: ${id}`);
    }
    return element;
  }

  /**
   * Actualizar el texto de un elemento
   */
  protected updateText(id: string, text: string): void {
    const element = this.getElement(id);
    if (element) {
      element.textContent = text;
    }
  }

  /**
   * Actualizar el HTML de un elemento
   */
  protected updateHTML(id: string, html: string): void {
    const element = this.getElement(id);
    if (element) {
      element.innerHTML = html;
    }
  }

  /**
   * Añadir clase CSS a un elemento
   */
  protected addClass(id: string, className: string): void {
    const element = this.getElement(id);
    if (element) {
      element.classList.add(className);
    }
  }

  /**
   * Quitar clase CSS de un elemento
   */
  protected removeClass(id: string, className: string): void {
    const element = this.getElement(id);
    if (element) {
      element.classList.remove(className);
    }
  }

  /**
   * Toggle clase CSS en un elemento
   */
  protected toggleClass(id: string, className: string): void {
    const element = this.getElement(id);
    if (element) {
      element.classList.toggle(className);
    }
  }

  /**
   * Mostrar un elemento
   */
  protected show(id: string, display: string = "block"): void {
    const element = this.getElement<HTMLElement>(id);
    if (element) {
      element.style.display = display;
    }
  }

  /**
   * Ocultar un elemento
   */
  protected hide(id: string): void {
    const element = this.getElement<HTMLElement>(id);
    if (element) {
      element.style.display = "none";
    }
  }

  /**
   * Añadir event listener de forma segura
   */
  protected onClick(id: string, handler: (e: Event) => void): void {
    const element = this.getElement(id);
    if (element) {
      element.addEventListener("click", handler);
    }
  }

  /**
   * Crear un elemento HTML
   */
  protected createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className?: string,
    content?: string
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    if (content) {
      element.textContent = content;
    }
    return element;
  }

  /**
   * Append un elemento a un contenedor
   */
  protected append(containerId: string, element: HTMLElement): void {
    const container = this.getElement(containerId);
    if (container) {
      container.appendChild(element);
    }
  }

  /**
   * Prepend un elemento a un contenedor
   */
  protected prepend(containerId: string, element: HTMLElement): void {
    const container = this.getElement(containerId);
    if (container) {
      container.insertBefore(element, container.firstChild);
    }
  }

  /**
   * Limpiar el contenido de un elemento
   */
  protected clear(id: string): void {
    const element = this.getElement(id);
    if (element) {
      element.innerHTML = "";
    }
  }
}
