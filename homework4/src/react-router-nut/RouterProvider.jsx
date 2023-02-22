import { DataRouterContext } from "./context";
import Router from "./Router";
import {useState, useLayoutEffect} from "react"
import Routes from "./Routes";

export default function RouterProvider({router}) {
    const [state, setState] = useState({
        action: router.history.action,
        location: router.history.location
    });

    useLayoutEffect(() => router.history.listen(setState), [router])

    return <DataRouterContext.Provider value={router}>
        <Router navigator={router.history} location={state.location} action={state.action}>
            <Routes/>
        </Router>
    </DataRouterContext.Provider>
};
