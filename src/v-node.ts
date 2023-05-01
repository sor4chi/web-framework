export type Props = Record<string, any>;

type VNodeChild = IVNode | string | number;

export interface IVNode {
  tag: string;
  props: Props;
  children: Array<VNodeChild>;
  update: (newVNode: IVNode) => void;
  render: () => HTMLElement;
}

export class VNode implements IVNode {
  tag: string;
  props: Props;
  children: Array<VNodeChild>;
  eventListeners: Record<string, EventListener> = {};

  constructor(tag: string, props: Props, children: Array<VNodeChild>) {
    this.tag = tag;
    this.props = props;
    this.setEventlistener(props);
    this.children = children;
  }

  setEventlistener(props: Props) {
    Object.keys(props).forEach((key) => {
      if (key.startsWith("on")) {
        const eventName = key.slice(2).toLowerCase();
        this.eventListeners[eventName] = props[key];
      }
    });
  }

  update(newVNode: VNodeChild) {
    if (typeof newVNode === "string" || typeof newVNode === "number") {
      this.children = [newVNode];
      return;
    }

    if (this.tag !== newVNode.tag) {
      throw new Error("Cannot update different tag VNode");
    }

    // update props
    const oldProps = this.props;
    const newProps = newVNode.props;
    Object.keys(newProps).forEach((key) => {
      if (oldProps[key] !== newProps[key]) {
        this.props[key] = newProps[key];
      }
    });
    Object.keys(oldProps).forEach((key) => {
      if (!(key in newProps)) {
        delete this.props[key];
      }
    });

    // update children
    const oldChildren = this.children;
    const newChildren = newVNode.children;
    if (oldChildren.length !== newChildren.length) {
      this.children = newChildren;
    } else {
      for (let i = 0; i < oldChildren.length; i++) {
        const oldChild = oldChildren[i];
        const newChild = newChildren[i];
        if (typeof oldChild === "string" && typeof newChild === "string") {
          if (oldChild !== newChild) {
            this.children[i] = newChild;
          }
        } else if (oldChild instanceof VNode && newChild instanceof VNode) {
          if (oldChild.tag !== newChild.tag) {
            this.children = newChildren;
            break;
          }
          oldChild.update(newChild);
        } else {
          this.children = newChildren;
          break;
        }
      }
    }

    // update event listeners
    this.setEventlistener(this.props);
  }

  render(): HTMLElement {
    const element = document.createElement(this.tag);
    Object.keys(this.props).forEach((key) => {
      element.setAttribute(key, this.props[key]);
    });
    Object.keys(this.eventListeners).forEach((key) => {
      element.addEventListener(key, this.eventListeners[key]);
    });
    this.children.forEach((child) => {
      if (typeof child === "string" || typeof child === "number") {
        element.appendChild(document.createTextNode(child.toString()));
      } else {
        element.appendChild(child.render());
      }
    });
    return element;
  }
}
