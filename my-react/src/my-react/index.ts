import { HostRootFiber } from "./fiber";
import { MyReactElement } from "./types";
import { commit } from "./commit";
import { listenToAllSupportedEvents } from "./syntheticEvent";
import { createWorkingProgress } from "./utils";

export * from "./jsx-dev-runtime";
export * from "./hooks";

export function createRoot(container: HTMLElement) {
  const hostRootFiber = new HostRootFiber(null, {});

  const root = new RootNode(container, hostRootFiber);
  hostRootFiber.stateNode = root;
  root.current = hostRootFiber;

  listenToAllSupportedEvents(container);

  return {
    render(element: MyReactElement) {
      hostRootFiber.update = {
        element,
        next: null,
      };

      workLoop(root, hostRootFiber);
    },
  };
}

export class RootNode {
  constructor(public container: HTMLElement, public current: HostRootFiber) {}
}

export function workLoop(root: RootNode, currentHostRootFiber: HostRootFiber) {
  let wip = createWorkingProgress(currentHostRootFiber);

  beginWork: while (wip) {
    const newChildFiber = wip.beginWork();

    if (!newChildFiber) {
      // complete
      let completedFiber = wip;
      while (completedFiber) {
        completedFiber.completeWork();

        const sibling = completedFiber.sibling;
        if (sibling) {
          wip = sibling;
          continue beginWork;
        }

        wip = wip.return;
        completedFiber = wip;
      }
    } else {
      wip = newChildFiber;
    }
  }

  commit(root);
}
