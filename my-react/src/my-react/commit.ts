import { MutationFlags } from "./constants";
import { RootNode } from "./index";

import { ChildDeletion, Placement } from "./constants";
import { HostComponentFiber } from "./fiber";
import { Fiber } from "./Fiber";
import {
  getHostParent,
  getHostSibling,
  insertFiberToContainer,
  removeFiberInContainer,
} from "./utils";

export function commit(root: RootNode) {
  const finishedHostRootFiber = root.current.alternate;
  if (
    (finishedHostRootFiber.flags & MutationFlags) !== 0 ||
    (finishedHostRootFiber.subtreeFlags & MutationFlags) !== 0
  ) {
    commitMutationEffectsOnFiber(finishedHostRootFiber);
  }

  console.log("commit阶段结束", { finishedHostRootFiber, root });

  root.current = finishedHostRootFiber;
}

export function commitMutationEffectsOnFiber(finishedWork: Fiber) {
  let child = finishedWork.child;
  while (child) {
    commitMutationEffectsOnFiber(child);
    child = child.sibling;
  }

  if ((finishedWork.flags & Placement) !== 0) {
    const parent = getHostParent(finishedWork);
    const sibling = getHostSibling(finishedWork);
    insertFiberToContainer(finishedWork, parent, sibling);
    finishedWork.flags &= ~Placement;
  }

  if ((finishedWork.flags & ChildDeletion) !== 0) {
    const parent =
      finishedWork instanceof HostComponentFiber
        ? finishedWork.stateNode
        : getHostParent(finishedWork);
    finishedWork.deletions.forEach((child) => {
      removeFiberInContainer(child, parent);
    });
    finishedWork.deletions.length = 0;
    finishedWork.flags &= ~ChildDeletion;
  }
}
