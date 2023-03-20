import { Fiber } from "./Fiber";

export class HostTextFiber extends Fiber {
  declare stateNode: Text;
  beginWork(): Fiber | null {
    return null;
  }

  completeWork(): void {
    const { content } = this.props;

    const current = this.alternate;
    if (!current) {
      this.stateNode = document.createTextNode(content);
      console.log(`创建text node, stateNode`, this.stateNode);
    } else {
      this.stateNode.textContent = content;
    }
  }
}
