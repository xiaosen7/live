import { REACT_ELEMENT_TYPE } from "./constants";

export interface Update {
  [K: string]: any;
}

export interface UpdateQueue {
  update: Update;
}

export interface MyReactElement {
  $$typeof: typeof REACT_ELEMENT_TYPE;

  // Built-in properties that belong on the element
  type: any;
  key: string;
  props: any;
}

export interface Hook {
  next: Hook | null;
  memoizeState: any;
}
