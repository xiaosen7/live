import { Fiber } from "./Fiber";
import { RootNode } from "..";
import { reconcileChildren } from "../reconcile";
import { bubbleProperties } from "../utils";

export class HostRootFiber extends Fiber {
  declare stateNode: RootNode;

  beginWork(): Fiber | null {
    const { element } = this.update;
    return reconcileChildren(this, element);
  }

  completeWork() {
    bubbleProperties(this);
  }
}
