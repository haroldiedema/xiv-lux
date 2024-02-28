/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
export class AbstractDirective {
    constructor(value) {
        this.value = value;
        this.isDisposed = false;
    }
    /**
     * Invokes the {@link AbstractDirective.dispose} method rather than the
     * {@link AbstractDirective.execute} method on the next render iteration.
     */
    markForDisposal() {
        this.isDisposed = true;
    }
    run(node, host, enqueueTask) {
        if (this.isDisposed) {
            return this.dispose(node, host, enqueueTask);
        }
        return this.execute(node, host, enqueueTask);
    }
}
//# sourceMappingURL=AbstractDirective.js.map