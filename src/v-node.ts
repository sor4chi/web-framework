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
  el?: HTMLElement;

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
    let updateSelf = false;
    if (typeof newVNode === "string" || typeof newVNode === "number") {
      this.children = [newVNode];
      return;
    }

    if (!this.sameVNode(newVNode)) {
      updateSelf = true;
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

    if (!updateSelf) {
      return;
    }

    // update event listeners
    this.setEventlistener(this.props);

    // update element
    if (this.el) {
      this.el.replaceWith(this.render());
    }
  }

  render(): HTMLElement {
    const element = document.createElement(this.tag);
    Object.keys(this.props).forEach((key) => {
      if (key === "value") {
        return;
      }
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
    this.el = element;
    return element;
  }

  sameTag(vNodeChild: VNodeChild) {
    if (typeof vNodeChild === "string" || typeof vNodeChild === "number") {
      return false;
    }
    if (vNodeChild instanceof VNode) {
      return this.tag === vNodeChild.tag;
    }
    return false;
  }

  sameProps(vNodeChild: VNodeChild) {
    if (typeof vNodeChild === "string" || typeof vNodeChild === "number") {
      return false;
    }
    if (vNodeChild instanceof VNode) {
      const oldProps = this.props;
      const newProps = vNodeChild.props;
      return Object.keys(oldProps).every((key) => {
        if (key === "value") {
          return true;
        }
        if (key.startsWith("on")) {
          return true;
        }
        return oldProps[key] === newProps[key];
      });
    }
    return false;
  }

  sameVNode(vNodeChild: VNodeChild) {
    const isSameTag = this.sameTag(vNodeChild);
    const isSameProps = this.sameProps(vNodeChild);
    console.log(
      `tag: ${this.tag}, isSameTag: ${isSameTag}, isSameProps: ${isSameProps}`
    );
    return isSameTag && isSameProps;
  }
}
