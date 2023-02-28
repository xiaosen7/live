import { FiberRootNode } from "./ReactFiberRoot";
import {
  WorkTag,
  HostRoot,
  HostComponent,
  HostText,
  ClassComponent,
  FunctionComponent,
  IndeterminateComponent,
  Fragment,
} from "./ReactWorkTags";
import { NoFlags } from "./ReactFiberFlags";
import { NoLanes } from "./ReactFiberLane";
import { Key, ReactElement, ReactFragment } from "my-shared/ReactTypes";
import { UpdateQueue } from "./ReactFiberClassUpdateQueue";
import { REACT_FRAGMENT_TYPE } from "my-shared/ReactSymbols";

export class FiberNode {
  tag: WorkTag;
  pendingProps: any;
  key: Key | null;
  elementType: null;
  type: any;
  // HostRoot -> fiberRootNode
  // ClassComponent  -> instance
  // HostComponent -> Element
  stateNode: any;
  return: FiberNode | null;
  child: FiberNode | null;
  sibling: FiberNode | null;
  index: number;
  ref: null;
  memoizedProps: null;
  updateQueue: UpdateQueue | null;
  memoizedState: any;
  dependencies: null;
  mode: any;
  flags: any;
  subtreeFlags: number;
  deletions: null;
  lanes: any;
  childLanes: any;
  alternate: FiberNode | null;

  constructor(tag: WorkTag, pendingProps: any, key: Key | null) {
    // Instance
    this.tag = tag;
    this.key = key;
    this.elementType = null;
    this.type = null;
    this.stateNode = null;

    // Fiber
    this.return = null;
    this.child = null;
    this.sibling = null;
    this.index = 0;

    this.ref = null;

    this.pendingProps = pendingProps;
    this.memoizedProps = null;
    this.updateQueue = null;
    this.memoizedState = null;
    this.dependencies = null;

    // Effects
    this.flags = NoFlags;
    this.subtreeFlags = NoFlags;
    this.deletions = null;

    this.lanes = NoLanes;
    this.childLanes = NoLanes;

    this.alternate = null;
  }
}

export function createHostRootFiber() {
  return createFiber(HostRoot, null, null);
}

export function createFiberFromText(content: string) {
  return createFiber(HostText, content, null);
}

export function createFiberFromFragment(elements: ReactFragment, key: any) {
  return createFiber(Fragment, elements, key);
}

export function createFiberFromElement(element: ReactElement) {
  const { type, props, key } = element;

  let fiberTag: WorkTag = IndeterminateComponent;
  if (typeof type === "function") {
    if (type.prototype?.isReactComponent) {
      fiberTag = ClassComponent;
    }
  } else if (typeof type === "string") {
    fiberTag = HostComponent;
  } else {
    switch (type) {
      case REACT_FRAGMENT_TYPE:
        return createFiberFromFragment(props.children, key);

      default:
        throw new Error("unrealized type: " + type);
    }
  }

  const fiber = createFiber(fiberTag, props, key);
  fiber.type = element.type;

  return fiber;
}

/**
 * 如果是被prepareFreshStack调用，那么current是hostRoot
 * @param current
 * @param pendingProps
 * @returns
 */
export function createWorkInProgress(current: FiberNode, pendingProps: any) {
  let workInProgress = current.alternate;
  if (workInProgress === null) {
    // We use a double buffering pooling technique because we know that we'll
    // only ever need at most two versions of a tree. We pool the "other" unused
    // node that we're free to reuse. This is lazily created to avoid allocating
    // extra objects for things that are never updated. It also allow us to
    // reclaim the extra memory if needed.
    workInProgress = createFiber(current.tag, pendingProps, current.key);
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;

    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps;
    // Needed because Blocks store data on type.
    workInProgress.type = current.type;

    // We already have an alternate.
    // Reset the effect tag.
    workInProgress.flags = NoFlags;

    // The effects are no longer valid.
    workInProgress.subtreeFlags = NoFlags;
    workInProgress.deletions = null;
  }

  // Reset all effects except static ones.
  // Static effects are not specific to a render.
  workInProgress.flags = current.flags;
  workInProgress.childLanes = current.childLanes;
  workInProgress.lanes = current.lanes;

  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;

  return workInProgress;
}

const createFiber = function (
  tag: WorkTag,
  pendingProps: any,
  key: Key | null
) {
  return new FiberNode(tag, pendingProps, key);
};
