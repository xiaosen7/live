import { useEffect } from "react";
import { useNavigate } from "./hooks";

export default function Navigate({to, state}) {
    const navigate = useNavigate();
    useEffect(() => {
        navigate(to, state)
    }, [to, state, navigate]);
}