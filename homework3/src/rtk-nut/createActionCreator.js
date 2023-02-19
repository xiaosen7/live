export function createActionCreator(type) {
  function actionCreator(payload) {
    return { type, payload };
  }

  actionCreator.type = type;
  // 让 `${actionCreator}` 等价于 `${type}`
  actionCreator.toString = () => type;

  return actionCreator;
}
