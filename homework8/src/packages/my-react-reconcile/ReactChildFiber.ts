import {
  createFiberFromElement,
  createFiberFromText,
  FiberNode,
} from "./ReactFiber";
import { ReactElement } from "my-shared/ReactTypes";
import { Placement } from "./ReactFiberFlags";
import { isValidElement } from "my-react/ReactElement";
import {
  REACT_ELEMENT_TYPE,
  REACT_FRAGMENT_TYPE,
} from "my-shared/ReactSymbols";

function ChildReconciler(shouldTrackSideEffects: boolean) {
  function reconcileSingleTextNode(
    returnFiber: FiberNode,
    currentFirstChild: FiberNode | null,
    textContent: string
  ) {
    const created = createFiberFromText(textContent);
    created.return = returnFiber;
    returnFiber.child = created;
    return created;
  }

  function reconcileSingleElement(
    returnFiber: FiberNode,
    currentFirstChild: FiberNode | null,
    newChildren: ReactElement
  ) {
    // 单子节点的字符串子节点会被优化从而不进到这里
    const child = createFiberFromElement(newChildren);
    child.return = returnFiber;
    returnFiber.child = child;
    return child;
  }

  function createSlot(returnFiber: FiberNode, newChild: any) {
    let newChildFiber: FiberNode;
    if (typeof newChild == "string" || typeof newChild === "number") {
      newChildFiber = createFiberFromText(newChild.toString());
    } else if (isValidElement(newChild)) {
      newChildFiber = createFiberFromElement(newChild);
    } else {
      throw new Error("unrealized child", newChild);
    }

    newChildFiber.return = returnFiber;
    return newChildFiber;
  }

  function reconcileChildrenArray(
    returnFiber: FiberNode,
    currentFirstChild: FiberNode | null,
    newChildren: ReactElement[]
  ) {
    let firstNewChildFiber: FiberNode | null = null;
    let previousNewChildFiber: FiberNode | null = null;
    for (let index = 0; index < newChildren.length; index++) {
      const newChild = newChildren[index];
      if (newChild === null) {
        continue;
      }

      const newChildFiber = createSlot(returnFiber, newChild);

      placeSingleChild(newChildFiber);
      if (firstNewChildFiber === null) {
        firstNewChildFiber = newChildFiber;
      } else {
        previousNewChildFiber!.sibling = newChildFiber;
      }

      previousNewChildFiber = newChildFiber;
    }

    if (firstNewChildFiber !== null) {
      firstNewChildFiber.return = returnFiber;
    }

    return firstNewChildFiber;
  }

  function placeSingleChild(newFiber: FiberNode) {
    if (shouldTrackSideEffects) {
      newFiber.flags |= Placement;
    }

    return newFiber;
  }

  function reconcileChildFibers(
    returnFiber: FiberNode,
    currentFirstChild: FiberNode | null,
    newChild: ReactElement
  ): FiberNode | null {
    if (Array.isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstChild, newChild);
    }

    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFirstChild, newChild)
          );
        default:
          throw new Error("unrealized nextChildren: " + newChild);
      }
    }

    if (
      (typeof newChild === "string" && newChild !== "") ||
      typeof newChild === "number"
    ) {
      // Fragment里面是纯text的话会来到这
      return placeSingleChild(
        reconcileSingleTextNode(returnFiber, currentFirstChild, "" + newChild)
      );
    }

    throw new Error("unrealized nextChildren: " + newChild);
  }

  return reconcileChildFibers;
}

export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
