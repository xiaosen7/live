import { ReactElement, ReactNodeList } from "my-shared/ReactTypes";
import { createFiberFromElement } from "./ReactFiber";
import { createUpdate, enqueueUpdate } from "./ReactFiberClassUpdateQueue";
import { FiberRootNode } from "./ReactFiberRoot";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";

export function updateContainer(element: ReactElement, root: FiberRootNode) {
  const current = root.current!;

  const update = createUpdate();
  update.payload = { element };
  enqueueUpdate(current, update);

  scheduleUpdateOnFiber(root, current);
}
