import { createHostRootFiber, FiberNode } from "./ReactFiber";
import { initializeUpdateQueue } from "./ReactFiberClassUpdateQueue";
import { Fiber } from "./ReactInternalTypes";

export class FiberRootNode {
  /**
   * HostRoot
   */
  current: FiberNode | null;
  containerInfo: Element;

  // A finished work-in-progress HostRoot that's ready to be committed.
  finishedWork: FiberNode | null;

  constructor(containerInfo: Element) {
    this.containerInfo = containerInfo;
    this.current = null;
    this.finishedWork = null;
  }
}

export function createFiberRoot(containerInfo: Element) {
  const root = new FiberRootNode(containerInfo);

  // Cyclic construction. This cheats the type system right now because
  // stateNode is any.

  // 结构如下
  // ReactDomRoot._internalRoot = FiberRootNode
  // FiberRootNode.current = hostRootFiber
  // hostRootFiber.stateNode = FiberRootNode
  const hostRootFiber = createHostRootFiber();
  root.current = hostRootFiber;
  hostRootFiber.stateNode = root;

  initializeUpdateQueue(hostRootFiber);

  return root;
}
