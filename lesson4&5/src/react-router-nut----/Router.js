import {useMemo} from "react";
import {NavigationContext} from "./Context";

export default function Router({navigator, children, location}) {
  const navigationContext = useMemo(
    () => ({
      navigator,
      location,
    }),
    [navigator, location]
  );

  return (
    <NavigationContext.Provider value={navigationContext}>
      {children}
    </NavigationContext.Provider>
  );
}
