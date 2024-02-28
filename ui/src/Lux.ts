/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
import { Container, Inject, Service } from "@/System/Services";
import { Socket } from "@/System/Socket";
import { Invoker } from "@/System/Socket/Invoker";

@Service()
class Lux
{
    @Inject private readonly socket: Socket;
    @Inject private readonly invoker: Invoker;

    constructor()
    {
        document.body.appendChild(document.createElement('lux-app'));
    }
}

// Bootstrap.
window.addEventListener('load', async () =>
    Container.compile().then(() => Container.get(Lux)));
