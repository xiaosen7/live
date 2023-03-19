import { createFiberRoot } from "my-react-reconcile/src/ReactFiberRoot";

export function createRoot(containerInfo: Element) {
  const fiberRoot = createFiberRoot(containerInfo);
  return new ReactDOMRoot(fiberRoot);
}
