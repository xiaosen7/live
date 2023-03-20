import { prepareHooks } from "../hooks";
import { Hook, MyReactElement } from "../types";
import { reconcileChildren } from "../reconcile";
import { bubbleProperties } from "../utils";
import { Fiber } from "./Fiber";

export class FunctionComponentFiber extends Fiber {
  declare type: (props: any) => MyReactElement;
  declare stateNode: Hook;

  beginWork(): Fiber | null {
    prepareHooks(this);
    const children = this.type(this.props);
    return reconcileChildren(this, children);
  }

  completeWork(): void {
    bubbleProperties(this);
  }
}
