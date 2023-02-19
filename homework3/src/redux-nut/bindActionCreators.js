export function bindActionCreators(creators, dispatch) {
  const ret = {};
  for (const name in creators) {
    if (Object.prototype.hasOwnProperty.call(creators, name)) {
      ret[name] = bindActionCreator(creators[name], dispatch);
    }
  }

  return ret;
}

export function bindActionCreator(creator, dispatch) {
  return (payload) => dispatch(creator(payload));
}
