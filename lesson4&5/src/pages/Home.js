import {NavLink} from "../which";

export default function Home(props) {
  return (
    <div>
      <h3>Home</h3>
      <NavLink to="/about">about</NavLink>
    </div>
  );
}
