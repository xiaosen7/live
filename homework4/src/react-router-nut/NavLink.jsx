import { useNavigate } from "./hooks";

export default function NavLink({to, children}) {
    const navigate = useNavigate();
    return <a onClick={e => {
        e.preventDefault();
        navigate(to);
    }} href={to}>{children}</a>
}