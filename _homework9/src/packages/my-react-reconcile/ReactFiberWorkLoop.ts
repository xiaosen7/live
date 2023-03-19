import { createWorkInProgress, FiberNode } from "./ReactFiber";
import { FiberRootNode } from "./ReactFiberRoot";
import { NormalPriority } from "my-scheduler/SchedulerPriorities";
import { scheduleCallback } from "my-scheduler/Scheduler";
import { beginWork } from "./ReactFiberBeginWork";
import { commitMutationEffects } from "./ReactFiberCommitWork";
import { completeWork } from "./ReactFiberCompleteWork";
import {
  BeforeMutationMask,
  LayoutMask,
  MutationMask,
  NoFlags,
  PassiveMask,
} from "./ReactFiberFlags";

let workInProgressRoot: FiberRootNode | null = null;
let workInProgress: FiberNode | null = null;

export function scheduleUpdateOnFiber(root: FiberRootNode, current: FiberNode) {
  ensureRootIsScheduled(root);
}

function ensureRootIsScheduled(root: FiberRootNode) {
  scheduleCallback(
    NormalPriority,
    performConcurrentWorkOnRoot.bind(null, root)
  );
}

function performConcurrentWorkOnRoot(root: FiberRootNode) {
  // We disable time-slicing in some cases: if the work has been CPU-bound
  // for too long ("expired" work, to prevent starvation), or we're in
  // sync-updates-by-default mode.
  // TODO: We only check `didTimeout` defensively, to account for a Scheduler
  // bug we're still investigating. Once the bug in Scheduler is fixed,
  // we can remove this, since we track expiration ourselves.
  const shouldTimeSlice = false;
  if (shouldTimeSlice) {
    // todo
    // renderRootConcurrent(root, lanes)
  } else {
    renderRootSync(root);
  }

  const finishedWork = root.current!.alternate!;
  root.finishedWork = finishedWork;

  finishConcurrentRender(root);
}

function renderRootSync(root: FiberRootNode) {
  prepareFreshStack(root);
  workLoopSync();
}

function workLoopSync() {
  // Already timed out, so perform work without checking if we need to yield.
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork: FiberNode) {
  const current = unitOfWork.alternate;
  const next = beginWork(current, unitOfWork);

  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
}

/**
 * 当前fiber的子树都已生成，这时会调用completeWork方法来做一些工作
 * 寻找下一个继续工作的节点，先兄弟再叔叔，找到了就把workInProgress赋值然后直接返回了
 * @param unitOfWork
 * @returns
 */
function completeUnitOfWork(unitOfWork: FiberNode) {
  // Attempt to complete the current unit of work, then move to the next
  // sibling. If there are no more siblings, return to the parent fiber.
  let completedWork = unitOfWork;
  while (completedWork !== null) {
    // The current, flushed, state of this fiber is the alternate. Ideally
    // nothing should rely on this, but relying on it here means that we don't
    // need an additional field on the work in progress.
    const current = completedWork.alternate;

    completeWork(current, completedWork);

    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      workInProgress = siblingFiber;
      return;
    }

    const returnFiber = completedWork.return;
    if (returnFiber === null) {
      // hostRoot的returnFiber是null
      // 所有fiber都已生成，跳出 workLoop 循环
      workInProgress = null;
      return;
    }

    // 到这里的时候说明当前节点已完成，并且他的兄弟也完成，那么接下来该父亲完成了
    completedWork = returnFiber;
  }
}

function finishConcurrentRender(root: FiberRootNode) {
  commitRoot(root);
}

function commitRoot(root: FiberRootNode) {
  const finishedWork = root.finishedWork!;

  // Check if there are any effects in the whole tree.
  // TODO: This is left over from the effect list implementation, where we had
  // to check for the existence of `firstEffect` to satisfy Flow. I think the
  // only other reason this optimization exists is because it affects profiling.
  // Reconsider whether this is necessary.
  const subtreeHasEffects =
    (finishedWork.subtreeFlags &
      (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask)) !==
    NoFlags;
  const rootHasEffect =
    (finishedWork.flags &
      (BeforeMutationMask | MutationMask | LayoutMask | PassiveMask)) !==
    NoFlags;

  if (subtreeHasEffects || rootHasEffect) {
    commitMutationEffects(root, finishedWork);
  }

  root.finishedWork = null;

  // The work-in-progress tree is now the current tree. This must come after
  // the mutation phase, so that the previous tree is still current during
  // componentWillUnmount, but before the layout phase, so that the finished
  // work is current during componentDidMount/Update.
  root.current = finishedWork;
}

function prepareFreshStack(root: FiberRootNode) {
  root.finishedWork = null;
  workInProgressRoot = root;
  const rootWorkInProgress = createWorkInProgress(root.current!, null);
  workInProgress = rootWorkInProgress;
}
