/**
 * Base class helpers for the updating state of a component.
 */

import { ReactNode } from "my-shared/ReactTypes";

class Component {
  state: any;
  refs: any;

  constructor(public props: any, public context: any) {}

  render(): ReactNode {
    throw new Error("unrealized method.");
  }

  setState() {
    throw new Error("unrealized method.");
  }

  forceUpdate() {
    throw new Error("unrealized method.");
  }
}

(Component.prototype as any).isReactComponent = {};

// ClassComponent extends Component { ... }
// => ClassComponent.prototype.__proto__ = Component.prototype
// => ClassComponent.prototype.isReactComponent = Component.prototype.isReactComponent

export { Component };
