/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { AbstractComponent, UIElement } from '@/System/Interface';
import { EnqueueTaskFn, MutationType } from '@/System/Interface/Attribute/MutationTask';
import { AbstractDirective } from '@/System/Interface/Directive';
import { VFragment } from '@/System/Interface/Node/VFragment';

export class VNode
{
    /**
     * The renderable element.
     */
    public element: Element | ShadowRoot = null;

    /**
     * The host element.
     */
    public hostElement: Element = null;

    /**
     * The parent node.
     */
    public parent?: VNode = null;

    /**
     * The index of this node in the collection of nodes in its parent node.
     */
    public index: number = -1;

    /**
     * Metadata that is persisted during the lifetime of this node.
     */
    public meta: { [name: string]: any; } = {};

    /**
     * A list of mutator functions that mutate this node's element during the
     * rendering process.
     */
    public mutators: ((enqueueTask: EnqueueTaskFn) => any)[] = [];

    /**
     * A list of directives to apply.
     */
    public directives: { [name: string]: AbstractDirective; } = {};

    private disposedDirectives: AbstractDirective[] = [];

    constructor(
        public readonly type: string | Function,
        public readonly attributes: { [name: string]: any; },
        public readonly children: (VNode | VFragment)[],
    )
    {
    }

    /**
     * Returns true if this is a "host"-element.
     */
    public get isHost(): boolean
    {
        return typeof this.type === 'string' && this.type === 'ui:host';
    }

    /**
     * Adds the mutator functions to create the initial node.
     */
    public create(): void
    {
        if (typeof this.type === 'function') {
            throw new Error('Functional components are unsupported.');
        }

        if (!this.isHost) {
            this.mutators.push(() =>
            {
                this.element = document.createElement(this.type as string);
                this.parent?.element?.appendChild(this.element);
            });
        }

        Object.keys(this.attributes).forEach((name) =>
        {
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
    public patch(node: VNode): VNode
    {
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

        const attrNames = Object.keys(node.attributes),
            toRemove = Object.keys(this.attributes).filter(attr => undefined === node.attributes[attr]);

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

            const newValue = node.attributes[name],
                oldValue = this.attributes[name];

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

            const patchedNode = this.children[i].patch(node.children[i] as any);

            if (this.children[i] !== patchedNode) {
                this.replaceChildNode(this.children[i], patchedNode as any, i);
                this.children[i].create();
            }
        }

        return this;
    }

    public render(host: UIElement<AbstractComponent>, enqueueTask: EnqueueTaskFn): void
    {
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

        Object.keys(this.directives).forEach((name) =>
        {
            this.directives[name].run(this, host, enqueueTask);
        });

        for (const child of this.children) {
            child.render(host, enqueueTask);
        }
    }

    /**
     * Dispose of this node.
     */
    public dispose(): void
    {
        if (this.element instanceof Element && this.element?.parentNode) {
            this.element.remove();
            this.element = null;
        }

        if (this.isHost) {
            this.children.forEach((child) => child.dispose());
        }
    }

    public assignChildNode(node: VNode | VFragment, index: number): void
    {
        this.children[index] = node;
        node.parent = this;
        node.index = index;
    }

    /**
     * Replace the given old node with the new node. This solely replaces the
     * virtual node and does nothing with the physical DOM node.
     */
    public replaceChildNode(oldNode: VNode | VFragment, newNode: VNode | VFragment, childIndex: number = null): void
    {
        childIndex = null !== childIndex ? childIndex : this.children.indexOf(oldNode);

        if (-1 === childIndex) {
            throw new Error(`The given child node is not a member of this node.`);
        }

        this.assignChildNode(newNode, childIndex);
        oldNode.dispose();
    }

    private isNodeOfSameType(nodeA: VNode | VFragment, nodeB: VNode | VFragment): boolean
    {
        if (nodeA instanceof VFragment) {
            return nodeB instanceof VFragment;
        }

        if (nodeB instanceof VFragment) {
            return false;
        }

        return nodeA.attributes['ui-key'] === nodeB.attributes['ui-key'] && nodeA.type === nodeB.type;
    }
}
