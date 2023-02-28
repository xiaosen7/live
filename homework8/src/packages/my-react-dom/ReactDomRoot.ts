import { updateContainer } from "my-react-reconcile/ReactFiberReconcile";
import {
  createFiberRoot,
  FiberRootNode,
} from "my-react-reconcile/ReactFiberRoot";
import { ReactElement, ReactNodeList } from "my-shared/ReactTypes";

class ReactDOMRoot {
  private _internalRoot: FiberRootNode;

  constructor(root: FiberRootNode) {
    this._internalRoot = root;
  }

  render(children: ReactElement) {
    const root = this._internalRoot;
    updateContainer(children, root);
  }
}

export function createRoot(containerInfo: Element) {
  const fiberRootNode = createFiberRoot(containerInfo);
  return new ReactDOMRoot(fiberRootNode);
}
