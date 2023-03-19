import { createRoot } from "my-react-dom";

import { useState, useReducer } from "my-react/ReactHooks";
// import {useReducer} from "react"
import "./main.css";

function TestUseState() {
  const [count, setCount] = useState(0);
  return (
    <>
      <h2>useState {count}</h2>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        {count}
      </button>
    </>
  );
}

function TestUseReducer() {
  const [num, addOrMinus] = useReducer((state: number, action) => {
    switch (action) {
      case "add":
        return state + 1;
      case "minus":
        return state - 1;
      default:
        break;
    }
  }, 0);

  return (
    <>
      <h2>useReducer {num}</h2>
      <button
        onClick={() => {
          addOrMinus("add");
        }}
      >
        +
      </button>
      <button
        onClick={() => {
          addOrMinus("minus");
        }}
      >
        -
      </button>
    </>
  );
}

const element = (
  <>
    <TestUseState />
    <TestUseReducer />
  </>
);

createRoot(document.getElementById("root")!).render(element);
