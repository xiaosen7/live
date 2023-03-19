import { FiberNode } from "./ReactFiber";

export type Update = {
  // TODO: Temporary field. Will remove this by storing a map of
  // transition -> event time on the root.
  //   tag: 0 | 1 | 2 | 3;
  payload: any;
  //   callback: Function | null;
  next: Update | null;
};

export type UpdateQueue = {
  // baseState: State,
  // firstBaseUpdate: Update | null,
  // lastBaseUpdate: Update | null,
  shared: SharedQueue;
  // effects: Array<Update> | null,
};

export type SharedQueue = {
  pending: Update | null;
  //   lanes: Lanes,
};

export function createUpdate() {
  const update: Update = {
    payload: null,
    next: null,
  };

  return update;
}

export function enqueueUpdate(fiber: FiberNode, update: Update) {
  const pending = fiber.updateQueue!.shared.pending;
  if (pending === null) {
    // This is the first update. Create a circular list.
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }

  fiber.updateQueue!.shared.pending = update;
}

export function initializeUpdateQueue(fiber: FiberNode): void {
  const queue: UpdateQueue = {
    shared: {
      pending: null,
    },
  };

  fiber.updateQueue = queue;
}

export function processUpdateQueue(workInProgress: FiberNode) {
  workInProgress.memoizedState =
    workInProgress.updateQueue!.shared.pending!.payload!;
}
