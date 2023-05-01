type Props = Record<string, any>;

interface IVNode {
  tag: string;
  props: Props;
  children: Array<IVNode | string>;
  update: (newVNode: IVNode) => void;
  render: () => HTMLElement;
}

export class VNode implements IVNode {
  tag: string;
  props: Props;
  children: Array<IVNode | string>;

  constructor(tag: string, props: Props, children: Array<IVNode | string>) {
    this.tag = tag;
    this.props = props;
    this.children = children;
  }

  update(newVNode: IVNode) {
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
  }

  render(): HTMLElement {
    const element = document.createElement(this.tag);
    Object.keys(this.props).forEach((key) => {
      element.setAttribute(key, this.props[key]);
    });
    this.children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child.render());
      }
    });
    return element;
  }
}
