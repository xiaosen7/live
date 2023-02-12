export function compose(...fns) {
  if (fns.length === 0) {
    return (x) => x;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return fns.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  );
}
