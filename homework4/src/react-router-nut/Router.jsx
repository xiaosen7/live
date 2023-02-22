import { useMemo } from "react";
import { LocationContext, NavigationContext } from "./context";


export default function Router({navigator, action, location, children}) {
    const navigationContextValue = useMemo(() => ({navigator}), [navigator]);
    const locationContextValue = useMemo(() => ({action, location}), [location, action]);
    
    return <NavigationContext.Provider value={navigationContextValue}>
        <LocationContext.Provider value={locationContextValue}>
        {children}
        </LocationContext.Provider>
    </NavigationContext.Provider>
}