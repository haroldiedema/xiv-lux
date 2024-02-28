/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     /
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/
import { MutationType } from '@/System/Interface/Attribute/MutationTask';
import { VFragment } from '@/System/Interface/Node/VFragment';
export class VNode {
    constructor(type, attributes, children) {
        this.type = type;
        this.attributes = attributes;
        this.children = children;
        /**
         * The renderable element.
         */
        this.element = null;
        /**
         * The host element.
         */
        this.hostElement = null;
        /**
         * The parent node.
         */
        this.parent = null;
        /**
         * The index of this node in the collection of nodes in its parent node.
         */
        this.index = -1;
        /**
         * Metadata that is persisted during the lifetime of this node.
         */
        this.meta = {};
        /**
         * A list of mutator functions that mutate this node's element during the
         * rendering process.
         */
        this.mutators = [];
        /**
         * A list of directives to apply.
         */
        this.directives = {};
        this.disposedDirectives = [];
    }
    /**
     * Returns true if this is a "host"-element.
     */
    get isHost() {
        return typeof this.type === 'string' && this.type === 'ui:host';
    }
    /**
     * Adds the mutator functions to create the initial node.
     */
    create() {
        if (typeof this.type === 'function') {
            throw new Error('Functional components are unsupported.');
        }
        if (!this.isHost) {
            this.mutators.push(() => {
                this.element = document.createElement(this.type);
                this.parent?.element?.appendChild(this.element);
            });
        }
        Object.keys(this.attributes).forEach((name) => {
            this.mutators.push((enqueueTask) => enqueueTask({
                type: MutationType.CREATE,
                node: this,
                name: name,
                data: this.attributes[name],
                prev: undefined,
            }));
        });
        for (const child of this.children) {
            child.create();
        }
    }
    /**
     * Patch this node with the data of the given node and adds mutator
     * functions to patch the DOM node based on the detected changes.
     */
    patch(node) {
        if (!this.isNodeOfSameType(this, node)) {
            return node;
        }
        // Find directives to remove...
        for (const name of Object.keys(this.directives)) {
            if (!node.directives[name] || node.directives[name].value !== this.directives[name].value) {
                this.directives[name].markForDisposal();
                this.disposedDirectives.push(this.directives[name]);
                delete this.directives[name];
            }
        }
        for (const name of Object.keys(node.directives)) {
            if (!this.directives[name]) {
                this.directives[name] = node.directives[name];
            }
        }
        const attrNames = Object.keys(node.attributes), toRemove = Object.keys(this.attributes).filter(attr => undefined === node.attributes[attr]);
        // Remove attributes.
        for (const name of toRemove) {
            this.mutators.push((enqueueTask) => enqueueTask({
                type: MutationType.REMOVE,
                node: this,
                name: name,
                data: undefined,
                prev: this.attributes[name],
            }));
            delete this.attributes[name];
        }
        for (const name of attrNames) {
            if (this.attributes[name] === node.attributes[name]) {
                continue;
            }
            const newValue = node.attributes[name], oldValue = this.attributes[name];
            this.mutators.push((enqueueTask) => enqueueTask({
                type: typeof this.attributes[name] === 'undefined' ? MutationType.CREATE : MutationType.UPDATE,
                node: this,
                name: name,
                data: newValue,
                prev: oldValue,
            }));
            this.attributes[name] = node.attributes[name];
        }
        // Find child nodes to remove.
        if (this.children.length > node.children.length) {
            while (this.children.length > node.children.length) {
                const childNode = this.children.pop();
                childNode?.dispose();
            }
        }
        // Find child nodes to append or patch.
        for (let i = 0, l = node.children.length; i < l; i++) {
            if (!this.children[i]) {
                this.assignChildNode(node.children[i], i);
                this.children[i].create();
                continue;
            }
            const patchedNode = this.children[i].patch(node.children[i]);
            if (this.children[i] !== patchedNode) {
                this.replaceChildNode(this.children[i], patchedNode, i);
                this.children[i].create();
            }
        }
        return this;
    }
    render(host, enqueueTask) {
        while (true) {
            const mutator = this.mutators.shift();
            if (!mutator) {
                break;
            }
            mutator(enqueueTask);
        }
        for (const directive of this.disposedDirectives) {
            directive.run(this, host, enqueueTask);
        }
        this.disposedDirectives = [];
        Object.keys(this.directives).forEach((name) => {
            this.directives[name].run(this, host, enqueueTask);
        });
        for (const child of this.children) {
            child.render(host, enqueueTask);
        }
    }
    /**
     * Dispose of this node.
     */
    dispose() {
        if (this.element instanceof Element && this.element?.parentNode) {
            this.element.remove();
            this.element = null;
        }
        if (this.isHost) {
            this.children.forEach((child) => child.dispose());
        }
    }
    assignChildNode(node, index) {
        this.children[index] = node;
        node.parent = this;
        node.index = index;
    }
    /**
     * Replace the given old node with the new node. This solely replaces the
     * virtual node and does nothing with the physical DOM node.
     */
    replaceChildNode(oldNode, newNode, childIndex = null) {
        childIndex = null !== childIndex ? childIndex : this.children.indexOf(oldNode);
        if (-1 === childIndex) {
            throw new Error(`The given child node is not a member of this node.`);
        }
        this.assignChildNode(newNode, childIndex);
        oldNode.dispose();
    }
    isNodeOfSameType(nodeA, nodeB) {
        if (nodeA instanceof VFragment) {
            return nodeB instanceof VFragment;
        }
        if (nodeB instanceof VFragment) {
            return false;
        }
        return nodeA.attributes['ui-key'] === nodeB.attributes['ui-key'] && nodeA.type === nodeB.type;
    }
}
//# sourceMappingURL=VNode.js.map