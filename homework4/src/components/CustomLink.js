import {NavLink} from "../which";

export default function CustomLink({to, ...rest}) {
  return (
    <NavLink
      to={to}
      {...rest}
      // style={({isActive}) => ({color: isActive ? "red" : "black"})}
    />
  );
}
