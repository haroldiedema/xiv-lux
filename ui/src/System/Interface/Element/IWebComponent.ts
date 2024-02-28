/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

export interface IWebComponent
{
    /**
     *  Invoked each time the custom element is moved to a new document.
     */
    adoptedCallback(): void;

    /**
     *  Invoked each time the custom element is appended into a
     *  document-connected element. This will happen each time the node is
     *  moved, and may happen before the element's contents have been fully
     *  parsed.
     *
     *  This method may be called once your element is no longer connected, use
     *  {@link Node.isConnected} to make sure.
     */
    connectedCallback(): void;

    /**
     * Invoked each time the custom element is disconnected from the document's
     * DOM.
     */
    disconnectedCallback(): void;

    /**
     * Invoked each time one of the custom element's attributes is added,
     * removed, or changed. Which attributes to notice change for is specified
     * in a "`static get observedAttributes`" method.
     */
    attributeChangedCallback(attributeName: string, oldValue?: string, newValue?: string): void;
}
