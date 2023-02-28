export function createInstance(type: string) {
  const domElement = document.createElement(type);
  return domElement;
}

export function appendInitialChild(
  parentInstance: HTMLElement,
  child: HTMLElement
): void {
  parentInstance.appendChild(child);
}

export function finalizeInitialChildren(dom: HTMLElement, props: any) {
  Object.keys(props).forEach((key) => {
    const value = props[key];
    if (key === "children") {
      if (typeof value === "string" || typeof value === "number") {
        dom.textContent = value.toString();
      }
    } else {
      // @ts-ignore
      dom[key] = value;
    }
  });
}
