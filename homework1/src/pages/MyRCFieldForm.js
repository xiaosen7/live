import React, { Component, useEffect } from "react";
import { Form, Field, useForm } from "../components/my-rc-field-form/";
import Input from "../components/Input";

const nameRules = { required: true, message: "请输入姓名！" };
const passwordRules = { required: true, message: "请输入密码！" };

// Hook函数 React内部的API
// 自定义Hook
export function FunctionComponent(props) {
  const [form] = useForm();

  const onFinish = (val) => {
    console.log("onFinish", val); //sy-log
  };

  // 表单校验失败执行
  const onFinishFailed = (val) => {
    console.log("onFinishFailed", val); //sy-log
  };

  useEffect(() => {
    console.log("form", form); //sy-log
    form.setFieldsValue({ username: "default" });
  }, []);

  return (
    <div>
      <h3>MyRCFieldForm 函数组件</h3>
      <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Field name="username" rules={[nameRules]}>
          <Input placeholder="input UR Username" />
        </Field>
        <Field name="password" rules={[passwordRules]}>
          <Input placeholder="input UR Password" />
        </Field>
        <button>Submit</button>
      </Form>
    </div>
  );
}

export class ClassComponent extends Component {
  formRef = React.createRef();
  componentDidMount() {
    console.log("form", this.formRef.current); //sy-log
    this.formRef.current.setFieldsValue({ username: "default" });
  }

  onFinish = (val) => {
    console.log("onFinish", val); //sy-log
  };

  // 表单校验失败执行
  onFinishFailed = (val) => {
    console.log("onFinishFailed", val); //sy-log
  };
  render() {
    return (
      <div>
        <h3>MyRCFieldForm 类组件</h3>
        <Form
          ref={this.formRef}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Field name="username" rules={[nameRules]}>
            <Input placeholder="Username" />
          </Field>
          <Field name="password" rules={[passwordRules]}>
            <Input placeholder="Password" />
          </Field>
          <button>Submit</button>
        </Form>
      </div>
    );
  }
}

// HOC
// 第三方的状态管理库store (state)
// get、set
// A B
// 订阅 （state变化，————组件更新(forceUpdate)————）
// 取消订阅
