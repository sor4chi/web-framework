import { VNode } from "./v-node";
import { Component } from "./component";

// const node = new VNode("div", { class: "container" }, [
//   new VNode("h1", {}, ["Hello, My Virtual DOM!"]),
//   new VNode("input", { type: "text" }, []),
//   new VNode("button", {}, ["Add"]),
//   new VNode("ul", {}, [
//     new VNode("li", {}, ["item 1"]),
//     new VNode("li", {}, ["item 2"]),
//     new VNode("li", {}, ["item 3"]),
//   ]),
// ]);

// document.body.appendChild(node.render());

const component = new Component({
  props: {},
  state: {
    count: 1,
  },
  render: (state, _, setState) => {
    return new VNode("div", {}, [
      new VNode("span", {}, [state.count]),
      new VNode(
        "button",
        { onclick: () => setState({ count: state.count + 1 }) },
        ["+"]
      ),
      new VNode(
        "button",
        { onclick: () => setState({ count: state.count - 1 }) },
        ["-"]
      ),
    ]);
  },
});

// const component = new Component({
//   props: {},
//   state: {
//     todos: ["item 1", "item 2", "item 3"],
//     inputValue: "",
//   },
//   render: (state, _, setState) => {
//     return new VNode("div", {}, [
//       new VNode(
//         "input",
//         {
//           type: "text",
//           value: state.inputValue,
//           oninput: (e: Event) => {
//             setTimeout(() => {
//               const target = e.target as HTMLInputElement;
//               setState({ inputValue: target.value });
//             }, 0);
//           },
//         },
//         []
//       ),
//       new VNode(
//         "button",
//         {
//           onclick: () => {
//             setState({
//               todos: [...state.todos, state.inputValue],
//               inputValue: "",
//             });
//           },
//         },
//         ["Add"]
//       ),
//       new VNode(
//         "ul",
//         {},
//         state.todos.map((todo) => new VNode("li", {}, [todo]))
//       ),
//     ]);
//   },
// });

component.mount(document.body);
