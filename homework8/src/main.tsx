import { createRoot } from "my-react-dom";
import { Component } from "my-react/ReactBaseClasses";
import "./main.css";

function FunctionComponent(props: any) {
  return <div>{props.name}</div>;
}

class ClassComponent extends Component {
  render() {
    return <div>ClassComponent</div>;
  }
}

//@ts-ignore
console.log(ClassComponent.prototype.__proto__ === Component.prototype);

const element = (
  <main className="border">
    <h1>react</h1>
    <a href="https://github.com/bubucuo/mini-react">mini react</a>

    <ClassComponent name="ClassComponent" />
    <>
      <FunctionComponent name="FunctionComponent" />
    </>
    <>Fragment</>
  </main>
);

createRoot(document.getElementById("root")!).render(element);
