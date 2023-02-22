import { useMemo } from "react";
import createRoutesFromChildren from "./createRoutesFromChildren"
import { useRoutes } from "./hooks";
import {useContext} from "react"
import { DataRouterContext } from "./context";

export default function Routes({children}) {
    // 如果有配置式路由就拿拿配置式路由的routes，否则根据children创建routes
    const dataRouterContext = useContext(DataRouterContext);
    const routes = useMemo(() =>  dataRouterContext?.routes || createRoutesFromChildren(children), [children, dataRouterContext]);
    return useRoutes(routes);
}