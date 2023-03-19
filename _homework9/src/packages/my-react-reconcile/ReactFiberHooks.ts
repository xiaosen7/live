import { FunctionComponent } from "my-shared/ReactTypes";
import { FiberNode } from "./ReactFiber";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";
import { ReactSharedInternals } from "my-shared/ReactSharedInternals";
import { Dispatcher } from "my-shared/ReactInternalTypes";

const { ReactCurrentDispatcher } = ReactSharedInternals;

const HooksDispatcherOnMount: Dispatcher = {
  useState: mountState,
  useReducer: mountReducer,
};
const HooksDispatcherOnUpdate: Dispatcher = {
  useState: updateState,
  useReducer: updateReducer,
};

const ContextOnlyDispatcher: Dispatcher = {
  useState: throwInvalidHookError,
  useReducer: throwInvalidHookError,
};

// Hooks are stored as a linked list on the fiber's memoizedState field. The
// current hook list is the list that belongs to the current fiber. The
// work-in-progress hook list is a new list that will be added to the
// work-in-progress fiber.
let currentlyRenderingFiber: FiberNode | null = null;
let workInProgressHook: Hook | null = null;

interface Hook {
  next: Hook | null;
  memoizedState: any;
  dispatch: any;
  reducer: (state: any, action: any) => any;
}

export function renderWithHooks(
  current: FiberNode | null,
  workInProgress: FiberNode,
  Component: FunctionComponent<any>
) {
  currentlyRenderingFiber = workInProgress;

  workInProgress.memoizedState = null;
  // workInProgress.updateQueue = null;

  if (current === null) {
    // mount
    ReactCurrentDispatcher.current = HooksDispatcherOnMount;
  } else {
    // update
    ReactCurrentDispatcher.current = HooksDispatcherOnUpdate;
  }

  const props = workInProgress.pendingProps;
  const nextChildren = Component(props);

  // We can assume the previous dispatcher is always this one, since we set it
  // at the beginning of the render phase and there's no re-entrance.
  ReactCurrentDispatcher.current = ContextOnlyDispatcher;

  currentlyRenderingFiber = null;
  workInProgressHook = null;

  return nextChildren;
}

function mountWorkInProgressHook() {
  const hook: Hook = {
    memoizedState: null,
    next: null,
    dispatch: null,
    reducer: basicStateReducer,
  };

  if (workInProgressHook === null) {
    // This is the first hook in the list
    currentlyRenderingFiber!.memoizedState = workInProgressHook = hook;
  } else {
    // Append to the end of the list
    workInProgressHook = workInProgressHook.next = hook;
  }

  return workInProgressHook;
}

function updateWorkInProgressHook() {
  // 不是初次渲染，是更新，意味着可以在老hook基础上更新
  const current = currentlyRenderingFiber!.alternate!;

  let hook: Hook;
  if (workInProgressHook === null) {
    // This is the first hook in the list.
    hook =
      workInProgressHook =
      currentlyRenderingFiber!.memoizedState =
        current.memoizedState;
  } else {
    // Append to the end of the list.
    workInProgressHook = workInProgressHook.next;
  }

  return workInProgressHook;
}

function mountState(initialState: any) {
  const hook = mountWorkInProgressHook();

  if (typeof initialState === "function") {
    initialState = initialState();
  }

  hook.memoizedState = initialState;
  const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber!, hook);

  // 保存起来，在update阶段服用dispatch
  hook.dispatch = dispatch;
  return [hook.memoizedState, dispatch];
}

function mountReducer(
  reducer: (state: any, action: any) => any,
  initialState: any
) {
  const hook = mountWorkInProgressHook();
  hook.reducer = reducer;
  hook.memoizedState = initialState;
  const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber!, hook);
  hook.dispatch = dispatch;
  return [hook.memoizedState, dispatch];
}

function updateState(initialState: any) {
  return updateReducer(basicStateReducer, initialState);
}

function updateReducer(
  reducer: (state: any, action: any) => any,
  initialState: any
) {
  const hook = updateWorkInProgressHook()!;
  hook.reducer = reducer;

  return [hook!.memoizedState, hook!.dispatch];
}

function basicStateReducer(state: any, action: any): any {
  return typeof action === "function" ? action(state) : action;
}

function dispatchSetState(fiber: FiberNode, hook: Hook, action: any) {
  // 用hook上的reducer更新，这个reducer在调用useXXX已经确定好了
  hook.memoizedState = hook.reducer(hook.memoizedState, action);

  let parent = fiber.return!;
  while (parent.return !== null) {
    parent = parent.return;
  }

  const root = parent.stateNode;
  scheduleUpdateOnFiber(root, fiber);
}

function throwInvalidHookError() {
  throw new Error(
    "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for" +
      " one of the following reasons:\n" +
      "1. You might have mismatching versions of React and the renderer (such as React DOM)\n" +
      "2. You might be breaking the Rules of Hooks\n" +
      "3. You might have more than one copy of React in the same app\n" +
      "See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem."
  );
}
