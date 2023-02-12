import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);

// const array1 = [1, 2, 3, 4];
// const reducer = (accumulator, currentValue) => accumulator + currentValue;

// // 1 + 2 + 3 + 4
// console.log(array1.reduce(reducer));
// // expected output: 10

// // 5 + 1 + 2 + 3 + 4
// console.log(array1.reduce(reducer, 5));
// // expected output: 15

// function f1(arg) {
//   console.log("f1", arg);
//   return arg;
// }
// function f2(arg) {
//   console.log("f2", arg);
//   return arg;
// }
// function f3(arg) {
//   console.log("f3", arg);
//   return arg;
// }

// f1("omg");
// f2("omg");
// f3("omg");

// f1(f2(f3("omg")));

// f1(f2(f3('omg')))
// 上一个函数的返回值是下一个函数的参数

// const res = f1(f2(f3("omg")));

// const res = compose(f1, f2, f3)("omg");

// console.log("res", res); //sy-log

// function compose(...funcs) {
//   if (funcs.length === 0) {
//     return (arg) => arg;
//   }

//   if (funcs.length === 1) {
//     return funcs[0];
//   }

//   return funcs.reduce(
//     (a, b) =>
//       (...args) =>
//         a(b(...args))
//   );
// }
