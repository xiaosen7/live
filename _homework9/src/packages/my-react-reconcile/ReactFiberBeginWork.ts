import { createFiberFromElement, FiberNode } from "./ReactFiber";
import {
  ClassComponent,
  Fragment,
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
  IndeterminateComponent,
} from "./ReactWorkTags";
import {
  FunctionComponent as FunctionComponentType,
  ReactElement,
} from "my-shared/ReactTypes";
import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";
import { Placement } from "./ReactFiberFlags";
import { processUpdateQueue } from "./ReactFiberClassUpdateQueue";
import {
  constructClassInstance,
  finishClassComponent,
} from "./ReactFiberClassComponent";
import { renderWithHooks } from "./ReactFiberHooks";

/**
 *
 * @param current 挂载的时候只有HostRoot的current有值，因为这之前prepareFreshStack创建了个新的
 * @param workInProgress
 * @returns
 */
export function beginWork(
  current: FiberNode | null,
  workInProgress: FiberNode
): FiberNode | null {
  switch (workInProgress.tag) {
    case FunctionComponent: {
      return updateFunctionComponent(
        current,
        workInProgress,
        workInProgress.type
      );
    }
    case ClassComponent:
      return updateClassComponent(current, workInProgress);
    case HostRoot:
      return updateHostRoot(current, workInProgress);
    case HostComponent:
      return updateHostComponent(current, workInProgress);
    case Fragment:
      return updateFragment(current, workInProgress);
    case HostText:
      return updateHostText(current, workInProgress);
    default:
      throw new Error("unrealized tag " + workInProgress.tag);
  }
}

function updateHostRoot(current: FiberNode | null, workInProgress: FiberNode) {
  processUpdateQueue(workInProgress);
  const nextState = workInProgress.memoizedState;
  const nextChildren = nextState.element;
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

function updateHostComponent(
  current: FiberNode | null,
  workInProgress: FiberNode
) {
  const nextProps = workInProgress.pendingProps;
  const nextChildren = nextProps.children;

  const isDirectTextChild = typeof nextChildren === "string";
  if (isDirectTextChild) {
    return null;
  }

  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

export function reconcileChildren(
  current: FiberNode | null,
  workInProgress: FiberNode,
  nextChildren: ReactElement | null
) {
  if (current === null) {
    // If this is a fresh new component that hasn't been rendered yet, we
    // won't update its child set by applying minimal side-effects. Instead,
    // we will add them all to the child before it gets rendered. That means
    // we can optimize this reconciliation pass by not tracking side-effects.
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
  } else {
    // If the current child is the same as the work in progress, it means that
    // we haven't yet started any work on these children. Therefore, we use
    // the clone algorithm to create a copy of all the current children.

    // If we had any progressed work already, that is invalid at this point so
    // let's throw it out.
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren
    );
  }
}

function updateFunctionComponent(
  current: FiberNode | null,
  workInProgress: FiberNode,
  Component: FunctionComponentType<any>
) {
  const nextChildren = renderWithHooks(current, workInProgress, Component);

  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

function updateClassComponent(
  current: FiberNode | null,
  workInProgress: FiberNode
) {
  const nextProps = workInProgress.pendingProps;
  const Component = workInProgress.type;
  constructClassInstance(workInProgress, Component, nextProps);
  const nextUnitOfWork = finishClassComponent(current, workInProgress);

  return nextUnitOfWork;
}

function updateFragment(current: FiberNode | null, workInProgress: FiberNode) {
  const nextChildren = workInProgress.pendingProps;
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

function updateHostText(current: FiberNode | null, workInProgress: FiberNode) {
  // Nothing to do here. This is terminal. We'll do the completion step
  // immediately after.
  return null;
}
