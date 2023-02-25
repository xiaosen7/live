import {useNavigate} from "./hooks";

export default function Link({to, children, ...rest}) {
  const navigate = useNavigate();
  const handle = (e) => {
    e.preventDefault();
    navigate(to);
  };
  return (
    <a {...rest} href={to} onClick={handle}>
      {children}
    </a>
  );
}
