import {useMatch, useResolvedPath} from "./hooks";
import Link from "./Link";

// todo
export default function NavLink({to, style: styleProp, ...rest}) {
  const resolvedPath = useResolvedPath(to);

  const isActive = useMatch({path: resolvedPath.pathname, end: true});

  let style =
    typeof styleProp === "function" ? styleProp({isActive}) : styleProp;
  return <Link {...rest} style={style} to={to} />;
}
