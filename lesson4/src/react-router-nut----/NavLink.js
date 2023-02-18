import {useResolvedPath, useMatch} from "./hooks";
import Link from "./Link";

export default function NavLink({style: styleProp, to, ...rest}) {
  const resolved = useResolvedPath(to);

  const isActive = useMatch({path: resolved.pathname, end: true});

  let style =
    typeof styleProp === "function" ? styleProp({isActive}) : styleProp;

  return <Link {...rest} style={style} to={to} />;
}
