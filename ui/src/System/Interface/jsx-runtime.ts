/* Lux, a Fintal Fantasy XIV Dalamud plugin         .____     ____ _______  ___
 *      for rich cartography interfaces.            |    |   |    |   \   \/  /
 *                                                  |    |   |    |   /\     / 
 * Package: Lux.FrontEnd                            |    |___|    |  / /     \ 
 * Author:  Harold Iedema <harold@iedema.me>        |_______ \______/ /___/\  \
 * -------------------------------------------------------- \/              \*/

import { DirectiveRegistry } from '@/System/Interface/Directive/DirectiveRegistry';
import { VFragment } from '@/System/Interface/Node/VFragment';
import { VNode } from '@/System/Interface/Node/VNode';

export function jsx(tagName: string, attributes: { [name: string]: any; })
{
    attributes = attributes ?? {};

    const children = !attributes.children ? [] : Array.isArray(attributes.children) ? attributes.children : [attributes.children];
    const childNodes = [] as (VNode | VFragment)[];
    const node = new VNode(tagName, attributes, childNodes);

    delete attributes.children;

    walkChildren(children, node, childNodes);
    normalizeClassAttribute(node);
    initializeDirectives(node);

    return node;
}

export const jsxs = jsx;
(self as any).jsx = jsx;

function walkChildren(children: any, node: VNode, childNodes: (VNode | VFragment)[]): void
{
    for (let i = 0, l = children.length; i < l; i++) {
        // Don't render NULL-elements.
        if (children[i] === undefined || children[i] === null || children[i] === false) {
            continue;
        }

        if (typeof children[i] === 'string' || typeof children[i] === 'boolean' || typeof children[i] === 'number') {
            const childNode = new VFragment(children[i]);
            childNode.parent = node;
            childNode.index = childNodes.length;
            childNodes.push(childNode);
        } else if (Array.isArray(children[i])) {
            walkChildren(children[i], node, childNodes);
        } else {
            children[i].parent = node;
            children[i].index = childNodes.length;
            childNodes.push(children[i]);
        }
    }
}

/**
 * Ensures the "class" or "className" attributes are normalized to a "class"
 * attribute with a list of CSS classes formatted as a string.
 */
function normalizeClassAttribute(node: VNode): void
{
    if (!('class' in node.attributes) && !('className' in node.attributes)) {
        return;
    }

    node.attributes['class'] = node.attributes['class'] ?? node.attributes['className'];

    if ('className' in node.attributes) {
        delete node.attributes['className'];
    }

    node.attributes['class'] = typeof node.attributes['class'] !== 'object'
        ? node.attributes['class']
        : Object.keys(node.attributes['class']).filter(k => !!node.attributes['class'][k]).join(' ');
}

function initializeDirectives(node: VNode): void
{
    Object.keys(node.attributes ?? {}).forEach((name: string) =>
    {
        if (false === name.startsWith('ui:')) {
            return;
        }

        const directiveName = name.slice(3);

        if (false === DirectiveRegistry.has(directiveName)) {
            throw new Error(`Directive ${directiveName} does not exist.`);
        }

        node.directives[directiveName] = (new (DirectiveRegistry.get(directiveName))(node.attributes[name]));
        delete node.attributes[name];
    });
}
