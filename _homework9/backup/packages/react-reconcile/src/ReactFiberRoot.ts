import { Fiber } from "./ReactInternalTypes";

export class FiberRoot {
  current: Fiber | null;
  containerInfo: Element;

  constructor(containerInfo: Element) {
    this.containerInfo = containerInfo;
    this.current = null;
  }
}

export function createFiberRoot(containerInfo) {
  return new FiberRoot(containerInfo);
}
