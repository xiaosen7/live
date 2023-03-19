import {
  createFiberFromElement,
  createFiberFromText,
  createWorkInProgress,
  FiberNode,
} from "./ReactFiber";
import { ReactElement, ReactNode } from "my-shared/ReactTypes";
import { ChildDeletion, Placement } from "./ReactFiberFlags";
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

  function deleteChild(returnFiber: FiberNode, childToDelete: FiberNode) {
    if (!shouldTrackSideEffects) {
      // Noop.
      return;
    }

    const deletions = returnFiber.deletions;
    if (deletions === null) {
      returnFiber.deletions = [childToDelete];
      returnFiber.flags |= ChildDeletion;
    } else {
      deletions.push(childToDelete);
    }
  }

  function deleteRemainingChildren(returnFiber: FiberNode) {
    if (!shouldTrackSideEffects) {
      // Noop.
      return null;
    }

    // TODO: For the shouldClone case, this could be micro-optimized a bit by
    // assuming that after the first child we've already added everything.
    let childToDelete = returnFiber.child;
    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }
    return null;
  }

  function reconcileSingleElement(
    returnFiber: FiberNode,
    currentFirstChild: FiberNode | null,
    element: ReactElement
  ) {
    // 单子节点的字符串子节点会被优化从而不进到这里

    const key = element.key;
    let child = currentFirstChild;

    // 这里目前只考虑之前是单子节点，现在也是单子节点的情况
    // TODO 如果之前是多子节点，现在是单子节点需要另外写

    if (child !== null) {
      // update阶段
      if (key === child.key && child.type === element.type) {
        // 如果可以复用fiber
        const existing = useFiber(child, element.props);
        existing.return = returnFiber;
        returnFiber.child = existing;
        // deleteRemainingChildren(returnFiber);
        return existing;
      } else {
        // 不能复用
        deleteRemainingChildren(returnFiber);
      }
    }

    child = createFiberFromElement(element);
    child.return = returnFiber;
    returnFiber.child = child;
    return child;
  }

  function updateSlot(
    returnFiber: FiberNode,
    oldChild: FiberNode,
    newChild: any
  ) {
    let newChildFiber: FiberNode;
    if (oldChild) {
      newChildFiber = useFiber(oldChild, newChild.pendingProps);
    } else {
      if (typeof newChild == "string" || typeof newChild === "number") {
        newChildFiber = createFiberFromText(newChild.toString());
      } else if (isValidElement(newChild)) {
        newChildFiber = createFiberFromElement(newChild);
      } else {
        throw new Error("unrealized child", newChild);
      }
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
    let oldFiber = currentFirstChild;
    for (let index = 0; index < newChildren.length; index++) {
      const newChild = newChildren[index];
      if (newChild === null) {
        continue;
      }

      const newChildFiber = updateSlot(returnFiber, oldFiber!, newChild);

      placeSingleChild(newChildFiber);
      if (firstNewChildFiber === null) {
        firstNewChildFiber = newChildFiber;
      } else {
        previousNewChildFiber!.sibling = newChildFiber;
      }

      previousNewChildFiber = newChildFiber;

      if (oldFiber) {
        oldFiber = oldFiber.sibling;
      }
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
    newChild: ReactElement | null
  ): FiberNode | null {
    // 如果newChild是不带key的fragment，那么让 newChild = newChild.props.children
    // This function is not recursive.
    // If the top level item is an array, we treat it as a set of children,
    // not as a fragment. Nested arrays on the other hand will be treated as
    // fragment nodes. Recursion happens at the normal flow.

    // Handle top level unkeyed fragments as if they were arrays.
    // This leads to an ambiguity between <>{[...]}</> and <>...</>.
    // We treat the ambiguous cases above the same.
    const isUnkeyedTopLevelFragment =
      typeof newChild === "object" &&
      newChild !== null &&
      newChild.type === REACT_FRAGMENT_TYPE &&
      newChild.key === null;
    if (isUnkeyedTopLevelFragment) {
      newChild = newChild!.props.children;
    }

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

function useFiber(fiber: FiberNode, pendingProps: any): FiberNode {
  // We currently set sibling to null and index to 0 here because it is easy
  // to forget to do before returning it. E.g. for the single child case.
  const clone = createWorkInProgress(fiber, pendingProps);
  clone.index = 0;
  clone.sibling = null;
  return clone;
}
