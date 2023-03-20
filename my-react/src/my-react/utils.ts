import { Placement, NoFlags, EventPropsKey } from "./constants";
import {
  HostComponentFiber,
  HostRootFiber,
  FunctionComponentFiber,
  HostTextFiber,
} from "./fiber";
import { Fiber } from "./fiber";

export function getHostParent(fiber: Fiber): HTMLElement {
  let parent = fiber.return;
  while (true) {
    if (parent instanceof HostComponentFiber) {
      return parent.stateNode;
    }

    if (parent instanceof HostRootFiber) {
      return parent.stateNode.container;
    }

    parent = parent.return;
  }
}

export function getHostSibling(fiber: Fiber) {
  findSibling: while (true) {
    while (!fiber.sibling) {
      // 自身没有弟弟就找父亲的弟弟
      const parent = fiber.return;
      if (parent === null) {
        return null;
      }

      if (parent instanceof HostComponentFiber) {
        // 如果当前fiber已经是最后一个元素并且父级又是host类型的，那么它不需要锚点
        return null;
      }

      fiber = parent;
    }

    fiber = fiber.sibling;

    while (fiber instanceof FunctionComponentFiber) {
      // 如果不是host类型的fiber，那么这个fiber的子节点有可能是host类型的，我们继续找它的子节点
      if ((fiber.flags & Placement) !== NoFlags) {
        // 这个fiber还没有插入，不能用
        continue findSibling;
      }

      if (fiber.child === null) {
        // 大叔子孙都找完了就递归地找下一个叔叔子孙
        continue findSibling;
      }

      fiber = fiber.child;
    }

    // 到这里node只能是HostText或HostComponent了
    if ((fiber.flags & Placement) === NoFlags) {
      return fiber.stateNode;
    }
  }
}

export function insertFiberToContainer(
  fiber: Fiber,
  parent: HTMLElement,
  sibling: HTMLElement | null
) {
  if (isHostChild(fiber)) {
    const node = fiber.stateNode;
    if (sibling) {
      parent.insertBefore(node, sibling);
    } else {
      parent.appendChild(node);
    }

    console.log("插入节点", node);
    return;
  }

  let child = fiber.child;
  while (child) {
    insertFiberToContainer(child, parent, sibling);
    child = child.sibling;
  }
}

export function removeFiberInContainer(fiber: Fiber, parent: HTMLElement) {
  if (isHostChild(fiber)) {
    const node = fiber.stateNode;
    parent.removeChild(node);
    console.log("删除节点", node);
    return;
  }

  let child = fiber.child;
  while (child) {
    removeFiberInContainer(child, parent);
    child = child.sibling;
  }
}

export function appendAllChildren(container: HTMLElement, parentFiber: Fiber) {
  let child = parentFiber.child;
  while (child) {
    if (!isHostChild(child)) {
      child = child.child;
      continue;
    }

    container.appendChild(child.stateNode);

    while (!child.sibling) {
      child = child.return;

      if (child === parentFiber) {
        return;
      }
    }

    child = child.sibling;
  }
}

function isHostChild(child: Fiber) {
  return child instanceof HostTextFiber || child instanceof HostComponentFiber;
}

export function updateProps(dom: HTMLElement, oldProps, newProps) {
  // 目前只处理了事件
  dom[EventPropsKey] = newProps;
  //   const isEventKey = (key) => /^on[A-Z]/.test(key);
  //   const getEventType = (key) => key.slice(2).toLowerCase();
  //   Object.entries(newProps).forEach(([key, newValue]) => {
  //     const oldValue = oldProps[key];
  //     if (oldValue === newValue) {
  //       return;
  //     }

  //     if (isEventKey(key)) {
  //       const eventType = getEventType(key);

  //       if (key in oldProps) {
  //         dom.removeEventListener(eventType, oldValue as any);
  //       }

  //       dom.addEventListener(eventType, newValue as any);
  //     }
  //   });

  //   Object.entries(oldProps).forEach(([key, oldValue]) => {
  //     if (!(key in newProps)) {
  //       if (isEventKey(key)) {
  //         const eventType = getEventType(key);
  //         dom.removeEventListener(eventType, oldValue as any);
  //       }
  //     }
  //   });
}

export function bubbleProperties(completedFiber: Fiber) {
  let subtreeFlags = NoFlags;
  let child = completedFiber.child;
  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;
    child = child.sibling;
  }

  completedFiber.subtreeFlags |= subtreeFlags;
}

export function createWorkingProgress(fiber: Fiber) {
  let workingProgress = fiber.alternate;
  if (!workingProgress) {
    workingProgress = Object.create(fiber);
  }

  Object.assign(workingProgress, fiber);

  workingProgress.alternate = fiber;
  fiber.alternate = workingProgress;

  return workingProgress;
}
