import { VNode } from "./v-node";
import { describe, expect, test } from "vitest";

describe("VNode", () => {
  test("render() should create an element with the correct tag name and attributes", () => {
    const props = { id: "example", class: "test" };
    const children = [new VNode("div", {}, [])];
    const vnode = new VNode("button", props, children);
    const element = vnode.render();
    expect(element.tagName).toBe("BUTTON");
    expect(element.getAttribute("id")).toBe("example");
    expect(element.getAttribute("class")).toBe("test");
    expect(element.children.length).toBe(1);
    expect(element.children[0].tagName).toBe("DIV");
  });

  test("update() should update the element's attributes and children", () => {
    const props1 = { id: "example", class: "test" };
    const children1 = [new VNode("div", {}, [])];
    const vnode1 = new VNode("button", props1, children1);

    const props2 = { id: "example", class: "updated" };
    const children2 = [new VNode("span", {}, [])];
    const vnode2 = new VNode("button", props2, children2);
    vnode1.update(vnode2);

    const element = vnode1.render();
    expect(element.tagName).toBe("BUTTON");
    expect(element.getAttribute("id")).toBe("example");
    expect(element.getAttribute("class")).toBe("updated");
    expect(element.children.length).toBe(1);
    expect(element.children[0].tagName).toBe("SPAN");
  });

  test("update() should throw an error if the tag name is different", () => {
    const vnode1 = new VNode("button", {}, []);
    const vnode2 = new VNode("div", {}, []);
    expect(() => vnode1.update(vnode2)).toThrow(
      "Cannot update different tag VNode"
    );
  });
});
