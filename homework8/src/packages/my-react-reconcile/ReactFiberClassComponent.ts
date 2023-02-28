import { FiberNode } from "./ReactFiber";
import { reconcileChildren } from "./ReactFiberBeginWork";

export function constructClassInstance(
  workInProgress: FiberNode,
  ctor: any,
  props: any
) {
  const instance = new ctor(props);
  workInProgress.stateNode = instance;
  return instance;
}

export function mountClassInstance() {}

export function finishClassComponent(
  current: FiberNode | null,
  workInProgress: FiberNode
) {
  const instance = workInProgress.stateNode;
  const nextChildren = instance.render();
  reconcileChildren(current, workInProgress, nextChildren);

  return workInProgress.child;
}
