import { context } from "./context";
import { useContext } from "react";

export function useStore() {
  return useContext(context);
}
