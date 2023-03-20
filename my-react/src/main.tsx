import { createRoot, useReducer, useMemo } from "./my-react";
import { MyReactElement } from "./my-react/types";

// function Component(props) {
//   const [state, dispatch] = useReducer((action, state) => {
//     switch (action) {
//       case "add":
//         return state + 1;
//       case "minus":
//         return state - 1;

//       default:
//         return state;
//     }
//   }, 0);
//   return (
//     <button
//       onClick={() => {
//         console.log("hello world");
//         dispatch("add");
//       }}
//     >
//       <span>{props.text1}</span>
//       <span>{props.text2}</span>
//       {state}
//     </button>
//   );
// }

function TestDomDiff() {
  const [count, dispatch] = useReducer((state, action) => {
    switch (action) {
      case "add":
        return state + 1;
      case "minus":
        return state - 1;

      default:
        return state;
    }
  }, 0);

  const [count2, dispatch2] = useReducer((state, action) => {
    switch (action) {
      case "add":
        return state + 1;
      case "minus":
        return state - 1;

      default:
        return state;
    }
  }, 0);

  return (
    <div>
      <h2>验证移动逻辑</h2>
      <button onClick={() => dispatch("add")}>{count}</button>
      {count % 2 === 0 ? (
        <ul>
          <li key="1">1</li>
          <li key="2">2</li>
          <li key="3">3</li>
        </ul>
      ) : (
        <ul>
          <li key="3">3</li>
          <li key="1">1</li>
          <li key="2">2</li>
        </ul>
      )}

      <h2>验证删除/新增逻辑</h2>
      <button onClick={() => dispatch2("minus")}>{count2}</button>
      {count2 % 2 === 0 ? (
        <ul>
          <li key="1">1</li>
          <li key="2">2</li>
          <li key="3">3</li>
        </ul>
      ) : (
        <ul>
          <li key="1">1</li>
          <li key="2">2</li>
        </ul>
      )}
    </div>
  );
}

// function TestUseMemo() {
//   const [ver, setVer] = useReducer((x) => x + 1, 0);
//   const value = useMemo(() => ver / 3, []);

//   return <button onClick={() => setVer()}>{value}</button>;
// }

// const jsx = (
//   <div>
//     <h1>hell</h1>
//     o
//     <Component text1="wo" text2="rld" />
//   </div>
// );

function TestSyntheticEvent() {
  return (
    <div
      onClick={() => {
        console.log("parent onClick");
      }}
      onClickCapture={(e) => {
        // e.stopPropagation();
        console.log("parent onClickCapture");
      }}
    >
      <button
        onClick={(e) => {
          // e.stopPropagation();
          console.log("child onClick");
        }}
        onClickCapture={(e) => {
          // e.stopPropagation();
          console.log("child onClickCapture");
        }}
      >
        点我
      </button>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  (<TestSyntheticEvent />) as MyReactElement
);
