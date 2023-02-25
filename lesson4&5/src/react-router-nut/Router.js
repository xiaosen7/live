import {NavigationContext} from "./Context";
import {useMemo} from "react";

export default function Router({children, location, navigator}) {
  const navigationContext = useMemo(
    () => ({navigator, location}),
    [navigator, location]
  );

  return (
    <NavigationContext.Provider children={children} value={navigationContext} />
  );
}
