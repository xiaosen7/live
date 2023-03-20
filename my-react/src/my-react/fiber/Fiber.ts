import { Update } from "../types";

export class Fiber {
  index: number;
  type: any;
  stateNode = null;
  update: Update;
  alternate: Fiber = null;

  sibling: Fiber = null;
  return = null;
  child: Fiber = null;

  deletions = [];
  flags: number;
  subtreeFlags: number;

  constructor(public key, public props) {}

  /**
   * beginWork阶段顺序是先自己，后儿子，再兄弟依次进行的，第一次进入的是HostRootFiber
   * 要做的事情是创建子fiber链表，打flags，返回第一个子fiber，
   * 尽量去复用老fiber，这里面涉及到dom diff操作
   */
  beginWork(): Fiber | null {
    return null;
  }

  /**
   * completeWork阶段是从下往上的，当一个fiber没有子节点，或者说子节点都已经完成了就会进入completeWork阶段
   * 要做的事情是创建/更新dom节点，append所有的儿子节点的dom到自己身上，收集子节点的flags
   */
  completeWork(): void {}
}
