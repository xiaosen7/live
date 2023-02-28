export type ReactElement = {
  type: any;
  key: any;
  props: any;
  ref: any;
  $$typeof: any;
};

export type Key = string | number | null;

export type ReactFragment = Iterable<ReactNode>;

export type ReactNode =
  | ReactElement
  | string
  | number
  | boolean
  | ReactFragment
  | null
  | undefined;

export type RefObject = {
  current: any;
};

export type ReactEmpty = null | void | boolean;

export type ReactNodeList = ReactEmpty | ReactElement;
