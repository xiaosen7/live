import { push, pop, peek } from "./SchedulerMinHeap";
import { getCurrentTime, isFn, isObject } from "shared/utils";
import {
  getTimeoutByPriorityLevel,
  NormalPriority,
  PriorityLevel,
} from "./SchedulerPriorities";

type Callback = any; // (args: any) => void | any;

export interface Task {
  id: number;
  callback: Callback;
  priorityLevel: PriorityLevel;
  startTime: number;
  expirationTime: number;
  sortIndex: number;
}

type HostCallback = (hasTimeRemaining: boolean, currentTime: number) => boolean;

// 任务存储，最小堆
const taskQueue: Array<Task> = [];
const timerQueue: Array<Task> = [];

let taskIdCounter: number = 1;

let currentTask: Task | null = null;
let currentPriorityLevel: PriorityLevel = NormalPriority;

// 在计时
let isHostTimeoutScheduled: boolean = false;

// 在调度任务
let isHostCallbackScheduled = false;
// This is set while performing work, to prevent re-entrance.
let isPerformingWork = false;

let schedulePerformWorkUntilDeadline: Function;
const channel = new MessageChannel();
const port = channel.port2;
channel.port1.onmessage = performWorkUntilDeadline;
schedulePerformWorkUntilDeadline = () => {
  port.postMessage(null);
};

let isMessageLoopRunning = false;
/**
 * flushWork
 */
let scheduledHostCallback: HostCallback | null = null;
let taskTimeoutID: any = -1;

let startTime = -1;

let needsPaint = false;

// Scheduler periodically yields in case there is other work on the main
// thread, like user events. By default, it yields multiple times per frame.
// It does not attempt to align with frame boundaries, since most tasks don't
// need to be frame aligned; for those that do, use requestAnimationFrame.
let frameInterval = 5; //frameYieldMs;

function cancelHostTimeout() {
  clearTimeout(taskTimeoutID);
}

function requestHostTimeout(callback: Callback, ms: number) {
  taskTimeoutID = setTimeout(() => callback(getCurrentTime()), ms);
}

// 检查timerQueue中的任务，是否有任务到期了呢，到期了就把当前有效任务移动到taskQueue
function advanceTimers(currentTime: number) {
  let timerTask = peek(timerQueue) as Task;
  while (timerTask !== null && timerTask.startTime <= currentTime) {
    pop(timerQueue);

    if (timerTask.callback !== null) {
      timerTask.sortIndex = timerTask.expirationTime;
      push(taskQueue, timerTask);
    }

    timerTask = peek(timerQueue) as Task;
  }
}

// 倒计时到点了
function handleTimeout(currentTime: number) {
  isHostTimeoutScheduled = false;
  advanceTimers(currentTime);

  if (isHostCallbackScheduled) {
    return;
  }

  if (peek(taskQueue) !== null) {
    isHostCallbackScheduled = true;
    requestHostCallback(flushWork);
  } else {
    const firstTimer = peek(timerQueue);
    if (firstTimer !== null) {
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }
  }
}

// todo
/**
 *
 * @param callback flushWork
 */
function requestHostCallback(callback: Callback) {
  // callback -> flushWork
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    scheduledHostCallback = callback;
    schedulePerformWorkUntilDeadline();
  }
}

function performWorkUntilDeadline() {
  if (scheduledHostCallback === null) {
    isMessageLoopRunning = false;
    return;
  }

  const currentTime = getCurrentTime();
  startTime = currentTime;
  const hasTimeRemaining = true;

  let hasMoreWork = true;
  try {
    hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
  } finally {
    if (hasMoreWork) {
      schedulePerformWorkUntilDeadline();
    } else {
      isMessageLoopRunning = false;
      scheduledHostCallback = null;
    }
  }
}

/**
 *
 * @param hasTimeRemaining
 * @param initialTime
 * @returns 是否还有任务没完成
 */
function flushWork(hasTimeRemaining: boolean, initialTime: number) {
  isHostCallbackScheduled = false;
  if (isHostTimeoutScheduled) {
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }

  isPerformingWork = true;
  try {
    return workLoop(hasTimeRemaining, initialTime);
  } finally {
    currentTask = null;
    isPerformingWork = false;
  }
}

function workLoop(hasTimeRemaining, initialTime) {
  let currentTime = initialTime;
  advanceTimers(currentTime);
  currentTask = peek(taskQueue);
  while (currentTask !== null) {
    // currentTask.expirationTime可以理解为当前任务应该执行的最迟时间点，但是呢在这之前如果时间片还有（shouldYieldToHost返回false），也可以执行当前任务
    // break的条件是：任务还没到最迟时间点 && 时间片不够了
    // 也就是说如果 当前时间 >= 任务最迟执行时间点 的时候，不管时间片够不够都要执行（尽管shouldYieldToHost返回true）
    if (
      /** 现在时间还早，任务执行不执行都无所谓 */ currentTask.expirationTime >
        currentTime &&
      (!hasTimeRemaining ||
        /** 应该让出cpu控制权（时间片不够了） */ shouldYieldToHost())
    ) {
      // This currentTask hasn't expired, and we've reached the deadline.
      break;
    }

    // 到这里只有两种情况
    // 1. 任务到了最迟执行的时间了（currentTime > expirationTime）
    // 2. 任务没到最迟执行时间但有时间片还有剩余
    const callback = currentTask.callback;
    if (typeof callback === "function") {
      currentTask.callback = null;
      const continuationCallback = callback();
      currentTime = getCurrentTime();

      if (typeof continuationCallback === "function") {
        currentTask.callback = continuationCallback;
        advanceTimers(currentTime);
        return true;
      }

      if (currentTask === peek(taskQueue)) {
        pop(taskQueue);
      }

      advanceTimers(currentTime);
    } else {
      pop(taskQueue);
    }

    currentTask = peek(taskQueue);
  }

  if (currentTask === null) {
    const firstTimer = peek(timerQueue);
    if (firstTimer !== null) {
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }

    return false;
  }

  return true;
}

function shouldYieldToHost() {
  return getCurrentTime() - startTime > frameInterval;
}

export function scheduleCallback(
  priorityLevel: PriorityLevel,
  callback: Callback,
  options?: { delay: number }
) {
  const currentTime = getCurrentTime();
  const startTime = options?.delay ? currentTime + options.delay : currentTime;

  const timeout = getTimeoutByPriorityLevel(priorityLevel);
  const expirationTime = startTime + timeout;

  const newTask: Task = {
    id: taskIdCounter++,
    callback,
    priorityLevel,
    startTime,
    expirationTime,
    sortIndex: -1,
  };

  if (startTime > currentTime) {
    newTask.sortIndex = startTime;
    push(timerQueue, newTask);
    if (peek(taskQueue) === null && peek(timerQueue) === newTask) {
      // All tasks are delayed, and this is the task with the earliest delay.
      if (isHostTimeoutScheduled) {
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      }

      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    newTask.sortIndex = expirationTime;
    push(taskQueue, newTask);
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }

  return newTask;
}

// 取消任务
export function cancelCallback(task: Task) {
  // Null out the callback to indicate the task has been canceled. (Can't
  // remove from the queue because you can't remove arbitrary nodes from an
  // array based heap, only the first one.)
  // 取消任务，不能直接删除，因为最小堆中只能删除堆顶元素
  task.callback = null;
}
