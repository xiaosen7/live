// import MyRCFormPage from "./pages/MyRCFormPage";
import { ClassComponent, FunctionComponent } from "./pages/MyRCFieldForm";

export default function App(props) {
  const state = 0;
  return (
    <div>
      {/* <MyRCFormPage /> */}

      <ClassComponent />
      <FunctionComponent />
    </div>
  );
}
