import { useContext } from "react";
import { RouteContext } from "./context";


export default function Outlet() {
    const {outlet} = useContext(RouteContext);
    return outlet
}