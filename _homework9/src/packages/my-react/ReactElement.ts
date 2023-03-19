import { REACT_ELEMENT_TYPE } from "my-shared/ReactSymbols";

/**
 * Verifies the object is a ReactElement.
 * See https://reactjs.org/docs/react-api.html#isvalidelement
 */
export function isValidElement(object: any) {
  return (
    typeof object === "object" &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
}
