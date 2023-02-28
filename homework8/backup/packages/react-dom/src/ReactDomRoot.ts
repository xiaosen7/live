import {
  createFiberRoot,
  FiberRoot,
} from "my-react-reconcile/src/ReactFiberRoot";

class ReactDOMRoot {
  private _internalRoot: FiberRoot;

  constructor(internalRoot: FiberRoot) {
    this._internalRoot = internalRoot;
  }

  render(children: ReactElement) {}
}

export function createRoot(containerInfo: Element) {
  const fiberRoot = createFiberRoot(containerInfo);
  return new ReactDOMRoot(fiberRoot);
}
