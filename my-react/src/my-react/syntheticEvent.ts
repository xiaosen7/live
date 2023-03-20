import { EventPropsKey } from "./constants";

const eventTypeToEventCallbackNames = {
  click: ["onClick", "onClickCapture"],
};

export function listenToAllSupportedEvents(rootContainer: HTMLElement) {
  Object.keys(eventTypeToEventCallbackNames).forEach((eventType) => {
    rootContainer.addEventListener(
      eventType,
      dispatchEvent.bind(null, rootContainer, eventType)
    );
  });
}

function dispatchEvent(
  rootContainer: HTMLElement,
  eventType: string,
  event: Event
) {
  // 收集事件回调函数
  const captureCallbacks = [];
  const bubbleCallbacks = [];
  let target = event.target as Node;
  while (target && target !== rootContainer) {
    const props = target[EventPropsKey];
    const [bubbleEventCallbackName, captureEventCallbackName] =
      eventTypeToEventCallbackNames[eventType];

    const bubbleEventCallback = props[bubbleEventCallbackName];
    const captureEventCallback = props[captureEventCallbackName];
    if (bubbleEventCallback) {
      bubbleCallbacks.push(bubbleEventCallback);
    }
    if (captureEventCallback) {
      captureCallbacks.unshift(captureEventCallback);
    }

    target = target.parentNode;
  }

  // 创建合成事件
  const syntheticEvent = Object.create(event);

  syntheticEvent.__stoppedPropagation = false;
  syntheticEvent.stopPropagation = () => {
    if (syntheticEvent.__stoppedPropagation) {
      return;
    }

    event.stopPropagation();
    syntheticEvent.__stoppedPropagation = true;
  };

  const eventFlow = [...captureCallbacks, ...bubbleCallbacks];
  for (const eventCallback of eventFlow) {
    eventCallback(syntheticEvent);

    if (syntheticEvent.__stoppedPropagation) {
      break;
    }
  }
}
