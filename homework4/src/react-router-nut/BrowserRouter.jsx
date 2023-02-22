import {createBrowserHistory} from "history"
import { useLayoutEffect, useRef, useState} from "react"
import Router from "./Router";

export default function BrowserRouter({children}) {
    const historyRef = useRef(null);
    if (!historyRef.current) {
        historyRef.current = createBrowserHistory();
    }

    /**
     * @type {import("history").History}
     */
    const history = historyRef.current;

    const [state, setState] = useState({
        action: history.action,
        location: history.location
    });

    useLayoutEffect(() => history.listen(setState), [history])

    return <Router children={children} navigator={history} action={state.action} location={state.location}/>
}