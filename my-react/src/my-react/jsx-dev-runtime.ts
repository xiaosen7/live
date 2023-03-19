import { REACT_ELEMENT_TYPE } from "./constants";

const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
};

export function jsxDEV(type: any, config: any, maybeKey: any) {
  // Reserved names are extracted
  const props: any = {};

  let key = null;
  let ref = null;

  if (maybeKey !== undefined) {
    key = "" + maybeKey;
  }

  if (config.key !== undefined) {
    key = "" + config.key;
  }

  if (config.ref !== undefined) {
    ref = config.ref;
  }

  // Remaining properties are added to a new props object
  let propName;
  for (propName in config) {
    if (
      Object.hasOwnProperty.call(config, propName) &&
      !RESERVED_PROPS.hasOwnProperty(propName)
    ) {
      props[propName] = config[propName];
    }
  }

  return ReactElement(type, key, ref, props);
}

function ReactElement(type: any, key: any, ref: any, props: any) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    // _owner: owner,
  };

  return element;
}
