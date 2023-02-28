export type RefObject = {
  current: any;
};

export type ReactEmpty = null | void | boolean;

export type ReactElement = {
  $$typeof: any;
  type: any;
  key: any;
  ref: any;
  props: any;
  // ReactFiber
  _owner: any;
};

export type ReactNodeList = ReactEmpty | ReactElement;
