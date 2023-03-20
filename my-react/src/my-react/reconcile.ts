import { ChildDeletion, Placement } from "./constants";
import {
  FunctionComponentFiber,
  HostComponentFiber,
  HostTextFiber,
  Fiber,
} from "./fiber";
import { MyReactElement } from "./types";
import { createWorkingProgress } from "./utils";

export function useFiber(fiber: Fiber, props) {
  const wip = createWorkingProgress(fiber);
  wip.props = props;
  return wip;
}

export function reconcileChildren(
  returnFiber: Fiber,
  newChildrenElements: (MyReactElement | string) | (MyReactElement | string)[]
) {
  if (!Array.isArray(newChildrenElements)) {
    newChildrenElements = [newChildrenElements];
  }

  const isUpdate = !!returnFiber.alternate;

  // 创建 existingChildren map
  const existingChildrenFibers = new Map<string, Fiber>();
  let currentChild = returnFiber.child;
  while (currentChild) {
    const key =
      currentChild.key != null ? currentChild.key : currentChild.index;
    existingChildrenFibers.set(key, currentChild);
    currentChild = currentChild.sibling;
  }

  let lastNewChildFiber: Fiber;
  let firstNewChildFiber: Fiber;
  let lastPlaceIndex = -1;
  for (let i = 0; i < newChildrenElements.length; i++) {
    const newChildElement = newChildrenElements[i];

    let newChildKey = null;
    const isTextContentTypeNewChild =
      typeof newChildElement === "string" ||
      typeof newChildElement === "number";
    if (isTextContentTypeNewChild) {
      newChildKey = i;
    } else {
      newChildKey = newChildElement.key != null ? newChildElement.key : i;
    }

    let newChildFiber: Fiber;
    const existingChildFiber = existingChildrenFibers.get(newChildKey);
    if (
      existingChildFiber &&
      isTextContentTypeNewChild &&
      existingChildFiber instanceof HostTextFiber
    ) {
      // 复用文本节点
      existingChildrenFibers.delete(newChildKey);
      const content = newChildElement;
      newChildFiber = useFiber(existingChildFiber, { content });
    } else if (
      existingChildFiber &&
      !isTextContentTypeNewChild &&
      existingChildFiber.type === newChildElement.type
    ) {
      // 复用非文本节点
      existingChildrenFibers.delete(newChildKey);
      newChildFiber = useFiber(existingChildFiber, newChildElement.props);
    } else {
      // 不能复用
      if (isTextContentTypeNewChild) {
        const content = newChildElement.toString();
        newChildFiber = new HostTextFiber(newChildKey, { content });
      } else {
        const { props, type } = newChildElement;
        if (typeof type === "function") {
          newChildFiber = new FunctionComponentFiber(newChildKey, props);
        } else {
          newChildFiber = new HostComponentFiber(newChildKey, props);
        }

        newChildFiber.type = type;
      }
    }

    newChildFiber.index = i;
    // 保持链表结构
    newChildFiber.sibling = null;
    newChildFiber.return = returnFiber;
    if (lastNewChildFiber) {
      lastNewChildFiber.sibling = newChildFiber;
    } else {
      firstNewChildFiber = newChildFiber;
    }
    lastNewChildFiber = newChildFiber;

    if (!isUpdate) {
      continue;
    }

    const current = newChildFiber.alternate;
    if (current) {
      // 复用的情况需要更新 lastPlaceIndex
      if (current.index < lastPlaceIndex) {
        // 移动
        newChildFiber.flags |= Placement;
      } else {
        // 不需要移动，但需要更新 lastPlaceIndex
        lastPlaceIndex = current.index;
      }
    } else {
      // 不能复用，插入新节点
      newChildFiber.flags |= Placement;
    }
  }

  returnFiber.child = firstNewChildFiber;

  if (existingChildrenFibers.size > 0) {
    // map中剩下的都是要删除的，因为这些fiber都没被复用
    returnFiber.flags |= ChildDeletion;
    existingChildrenFibers.forEach((existing) => {
      returnFiber.deletions.push(existing);
    });
  }

  return returnFiber.child;
}
