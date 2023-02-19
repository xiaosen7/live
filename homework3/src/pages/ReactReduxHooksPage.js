// import {useDispatch, useSelector} from "react-redux";
import {useDispatch, useSelector} from "../react-redux-nut";
import {increment} from "../store/counterSlice";

export default function ReactReduxHooksPage(props) {
  const counter = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  return (
    <div>
      <h3>ReactReduxHooksPage</h3>

      <button
        onClick={() => {
          dispatch(increment());
        }}>
        {counter.value}
      </button>
    </div>
  );
}
