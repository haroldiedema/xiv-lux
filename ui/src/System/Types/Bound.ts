/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

export function Bound(_: any, propertyKey: string, descriptor: PropertyDescriptor)
{
    const originalMethod = descriptor.value;

    descriptor.get = function (this: any)
    {
        // Memoize the bound method to avoid rebinding
        const boundMethod = originalMethod.bind(this);

        // Define a new property with the bound method
        Object.defineProperty(this, propertyKey, {
            value: boundMethod,
            configurable: true,
            writable: true
        });

        // Return the bound method
        return boundMethod;
    };

    // Clear out the original method to avoid accidental access
    delete descriptor.value;
    delete descriptor.writable;

    return descriptor;
}
