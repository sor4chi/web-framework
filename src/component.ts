import { IVNode, VNode, Props } from "./v-node";

type State = Record<string, any>;

export class Component<S extends State = {}, P extends Props = {}> {
  private _vNode: IVNode;
  state: S;
  props: P;
  render: (
    state: S,
    props: P,
    setState: (newState: Partial<S>) => void
  ) => IVNode;

  constructor({
    state,
    props,
    render,
  }: {
    state: S;
    props: P;
    render: (
      state: S,
      props: P,
      setState: (newState: Partial<S>) => void
    ) => IVNode;
  }) {
    this.state = state;
    this.props = props;
    this._vNode = render(state, props, this.setState.bind(this));
    this.render = render;
  }

  private updateState(newState: Partial<S>) {
    this.state = { ...this.state, ...newState };
    this.rerender();
  }

  setState(newState: Partial<S>) {
    this.updateState(newState);
  }

  rerender() {
    const newVNode = this.render(
      this.state,
      this.props,
      this.setState.bind(this)
    );
    this._vNode.update(newVNode);
  }

  mount(target: HTMLElement) {
    const element = this._vNode.render();
    target.appendChild(element);
  }

  unmount(target: HTMLElement) {
    const element = this._vNode.render();
    target.removeChild(element);
  }
}
