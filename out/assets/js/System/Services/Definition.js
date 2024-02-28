/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
export class Definition {
    constructor(classDeclaration, tags, initializer, dependencies, taggedDependencies, delegateDependencies, sharedEventEmitters, ancestors, fileName) {
        this.classDeclaration = classDeclaration;
        this.tags = tags;
        this.initializer = initializer;
        this.dependencies = dependencies;
        this.taggedDependencies = taggedDependencies;
        this.delegateDependencies = delegateDependencies;
        this.sharedEventEmitters = sharedEventEmitters;
        this.ancestors = ancestors;
        this.fileName = fileName;
    }
}
//# sourceMappingURL=Definition.js.map