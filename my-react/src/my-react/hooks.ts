import { workLoop } from ".";
import { FunctionComponentFiber, HostRootFiber } from "./fiber";
import { Hook } from "./types";

let currentRenderingFiber: FunctionComponentFiber;
let lastHook: Hook = null;

export function prepareHooks(fiber: FunctionComponentFiber) {
  currentRenderingFiber = fiber;
  lastHook = null;
}

function useHook(initialState) {
  const isUpdate = !!currentRenderingFiber.alternate;

  let hook: Hook;
  if (isUpdate) {
    hook = lastHook ? lastHook.next : currentRenderingFiber.stateNode;
  } else {
    hook = {
      next: null,
      memoizeState: initialState,
    };

    if (lastHook) {
      lastHook.next = hook;
    } else {
      // 第一个hook
      currentRenderingFiber.stateNode = hook;
    }
  }

  lastHook = hook;
  return hook;
}

export function useReducer(reducer, initialState) {
  const hook = useHook(initialState);

  return [
    hook.memoizeState,
    dispatch.bind(null, currentRenderingFiber, hook, reducer),
  ];
}

export function useMemo(callback, deps: any[]) {
  const hook = useHook({
    value: null,
    deps: null,
  });

  const lastDeps = hook.memoizeState.deps;
  const depsChanged =
    !lastDeps ||
    lastDeps.length !== deps.length ||
    deps.some((x, i) => x !== lastDeps[i]);

  if (depsChanged) {
    console.log("useMemo依赖变化,重新执行");
    hook.memoizeState.value = callback();
    hook.memoizeState.deps = deps;
  }

  return hook.memoizeState.value;
}

function dispatch(fiber: FunctionComponentFiber, hook: Hook, reducer, action) {
  hook.memoizeState = reducer(hook.memoizeState, action);

  while (!(fiber instanceof HostRootFiber)) {
    fiber = fiber.return;
  }

  const hostRoot = fiber as HostRootFiber;
  workLoop(hostRoot.stateNode, hostRoot);
}
