import { FiberNode } from "./ReactFiber";
import { NoFlags } from "./ReactFiberFlags";
import {
  appendInitialChild,
  createInstance,
  finalizeInitialChildren,
} from "./ReactFiberHostConfig";
import {
  ClassComponent,
  Fragment,
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
  IndeterminateComponent,
} from "./ReactWorkTags";

/**
 * 生成fiber对应的dom节点
 * 往自己身dom上插入子dom节点
 * 收集subtreeFlags
 * @param current
 * @param workInProgress
 */
export function completeWork(
  current: FiberNode | null,
  workInProgress: FiberNode
) {
  const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    // 这些都是本身是不产生dom节点的，不需要做dom相关的操作，只需要收集flags
    case FunctionComponent:
    case ClassComponent:
    case IndeterminateComponent:
    case Fragment:
    case HostRoot:
      bubbleProperties(workInProgress);
      break;

    case HostComponent: {
      const { type } = workInProgress;
      const instance = createInstance(type);
      appendAllChildren(instance, workInProgress);
      finalizeInitialChildren(instance, newProps);
      workInProgress.stateNode = instance;
      bubbleProperties(workInProgress);
      break;
    }

    case HostText: {
      const newText = newProps;
      workInProgress.stateNode = document.createTextNode(newText);
      bubbleProperties(workInProgress);
      break;
    }

    default:
      throw new Error("unrealize workInProgress.tag: " + workInProgress.tag);
  }
}

/**
 * 把workInProgress的子孙所有dom节点插入到workInProgress的statNode上
 * @param parent
 * @param workInProgress
 * @returns
 */
function appendAllChildren(parent: HTMLElement, workInProgress: FiberNode) {
  // We only have the top Fiber that was created but we need recurse down its
  // children to find all the terminal nodes.
  let node = workInProgress.child;
  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      // node是host类型的，插入它
      appendInitialChild(parent, node.stateNode);
    } else if (node.child !== null) {
      // node不是host类型的，那么它的儿子可能有host类型的，继续遍历儿子
      node = node.child;
      continue;
    }

    if (node === workInProgress) {
      return;
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        return;
      }

      node = node.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
}

/**
 * 把completedWork的子孙节点的标记收集到completedWork.subtreeFlags上
 *
 * 初次挂载的时候，只有hostRoot.child（main标签对应的fiber）有placement的flag
 * @param completedWork
 */
function bubbleProperties(completedWork: FiberNode) {
  let child = completedWork.child;
  let subtreeFlags = NoFlags;
  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;

    child = child.sibling;
  }

  completedWork.subtreeFlags |= subtreeFlags;
}
