import { Fiber } from "./Fiber";
import { reconcileChildren } from "../reconcile";
import { updateProps, appendAllChildren, bubbleProperties } from "../utils";

export class HostComponentFiber extends Fiber {
  declare type: keyof HTMLElementTagNameMap;
  declare stateNode: HTMLElement;
  beginWork() {
    const children = this.props.children;
    return reconcileChildren(this, children);
  }

  completeWork() {
    const current = this.alternate;
    if (current) {
      updateProps(this.stateNode, current.props, this.props);
    } else {
      this.stateNode = document.createElement(this.type);
      console.log(`创建node`, this.stateNode);
      updateProps(this.stateNode, {}, this.props);
      appendAllChildren(this.stateNode, this);
    }

    bubbleProperties(this);
  }
}
