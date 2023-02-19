export function executeBuilderCallback(callback) {
  const typeToReducerMap = {};
  const builder = {
    addCase(type, reducer) {
      typeToReducerMap[type] = reducer;
      return builder;
    },
  };

  callback(builder);

  return typeToReducerMap;
}
