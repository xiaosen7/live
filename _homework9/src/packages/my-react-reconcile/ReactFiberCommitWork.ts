import { FiberNode } from "./ReactFiber";
import { NoFlags, Placement } from "./ReactFiberFlags";
import { FiberRootNode } from "./ReactFiberRoot";
import { HostComponent, HostPortal, HostRoot, HostText } from "./ReactWorkTags";

export function commitMutationEffects(
  root: FiberRootNode,
  finishedWork: FiberNode
) {
  commitMutationEffectsOnFiber(finishedWork, root);
}

function commitMutationEffectsOnFiber(
  finishedWork: FiberNode,
  root: FiberRootNode
) {
  // 从子到父提交变更
  recursivelyTraverseMutationEffects(root, finishedWork);
  commitReconciliationEffects(finishedWork);
  // switch (finishedWork.tag) {
  //   case HostRoot:
  //     recursivelyTraverseMutationEffects(root, finishedWork);
  //     commitReconciliationEffects(finishedWork);
  //     break;
  //   case HostText:
  //     recursivelyTraverseMutationEffects(root, finishedWork);
  //     commitReconciliationEffects(finishedWork);
  //     break;
  //   case HostComponent:
  //     recursivelyTraverseMutationEffects(root, finishedWork);
  //     commitReconciliationEffects(finishedWork);
  //     break;
  //   default: {
  //     recursivelyTraverseMutationEffects(root, finishedWork);
  //     commitReconciliationEffects(finishedWork);
  //     return;
  //   }
  // }
}

function recursivelyTraverseMutationEffects(
  root: FiberRootNode,
  parentFiber: FiberNode
) {
  // Deletions effects can be scheduled on any fiber type. They need to happen
  // before the children effects hae fired.
  const deletions = parentFiber.deletions;
  if (deletions !== null) {
    for (let i = 0; i < deletions.length; i++) {
      const childToDelete = deletions[i];
      commitDeletionEffects(root, parentFiber, childToDelete);
    }
  }

  let child = parentFiber.child;
  while (child != null) {
    commitMutationEffectsOnFiber(child, root);
    child = child.sibling;
  }
}

function commitDeletionEffects(
  root: FiberRootNode,
  parentFiber: FiberNode,
  childToDelete: FiberNode
) {}

function commitReconciliationEffects(finishedWork: FiberNode) {
  const flags = finishedWork.flags;
  if (flags & Placement) {
    commitPlacement(finishedWork);
    finishedWork.flags &= ~Placement;
  }
}

function commitPlacement(finishedWork: FiberNode) {
  const parentFiber = getHostParentFiber(finishedWork);

  switch (parentFiber.tag) {
    case HostComponent: {
      const parent = parentFiber.stateNode;
      const before = getHostSibling(finishedWork);
      insertOrAppendPlacementNode(finishedWork, before, parent);
      break;
    }

    case HostRoot: {
      const parent = parentFiber.stateNode.containerInfo;
      const before = getHostSibling(finishedWork);
      insertOrAppendPlacementNode(finishedWork, before, parent);
      break;
    }

    default:
      throw new Error(
        "Invalid host parent fiber. This error is likely caused by a bug " +
          "in React. Please file an issue."
      );
  }
}

function getHostParentFiber(fiber: FiberNode): FiberNode {
  let parent = fiber.return;
  while (parent !== null) {
    if (isHostParent(parent)) {
      return parent;
    }

    parent = parent.return;
  }

  throw new Error(
    "Expected to find a host parent. This error is likely caused by a bug " +
      "in React. Please file an issue."
  );
}

function isHostParent(fiber: FiberNode): boolean {
  return (
    fiber.tag === HostComponent ||
    fiber.tag === HostRoot ||
    fiber.tag === HostPortal
  );
}

function getHostSibling(fiber: FiberNode) {
  let node = fiber;
  findSibling: while (true) {
    // 没有弟弟就找叔叔子孙
    while (node.sibling === null) {
      const parent = node.return;
      // 为啥要有isHostParent这个判断？
      // 因为当前node已经是最后一个元素，不需要锚点
      if (parent === null || isHostParent(parent)) {
        return null;
      }

      node = parent;
    }

    node = node.sibling;

    // 如果不是host类型的fiber，那么这个fiber的子节点有可能是host类型的，我们继续找它的子节点
    while (node.tag !== HostText && node.tag !== HostComponent) {
      if ((node.flags & Placement) !== NoFlags) {
        // 这个fiber还没有插入，不能用
        continue findSibling;
      }

      if (node.child === null) {
        // 大叔子孙都找完了就递归地找下一个叔叔子孙
        continue findSibling;
      }

      node = node.child;
    }

    // 到这里node只能是HostText或HostComponent了
    if ((node.flags & Placement) === NoFlags) {
      return node;
    }
  }
}

function insertOrAppendPlacementNode(
  fiber: FiberNode,
  before: FiberNode | null,
  container: Element
) {
  const stateNode = fiber.stateNode;
  if (fiber.tag === HostComponent || fiber.tag === HostText) {
    if (before === null) {
      container.appendChild(stateNode);
    } else {
      container.insertBefore(stateNode, before.stateNode);
    }
  } else {
    const child = fiber.child;
    if (child !== null) {
      insertOrAppendPlacementNode(child, before, container);

      let sibling = child.sibling;
      while (sibling !== null) {
        insertOrAppendPlacementNode(sibling, before, container);
        sibling = sibling.sibling;
      }
    }
  }
}
