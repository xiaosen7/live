import {useRef} from "react";

class FormStore {
  constructor(props) {
    // 状态仓库
    this.store = {};
    // 组件实例
    this.fieldEntities = [];

    this.callbacks = {};
  }

  setCallbacks = (newCallbacks) => {
    this.callbacks = {
      ...this.callbacks,
      ...newCallbacks,
    };
  };

  // 订阅实例
  registerFieldEntity = (entity) => {
    this.fieldEntities.push(entity);

    // 取消订阅
    return () => {
      this.fieldEntities = this.fieldEntities.filter((item) => item != entity);
      delete this.store[entity.props.name];
    };
  };
  // get state
  getFieldValue = (name) => {
    return this.store[name];
  };

  getFieldsValue = () => {
    return {...this.store};
  };

  // {username: 123}
  setFieldsValue = (newStore) => {
    this.store = {
      ...this.store,
      ...newStore,
    };

    // 更新Field组件
    this.fieldEntities.forEach((entity) => {
      // todo 找到对应的Field更新
      Object.keys(newStore).forEach((k) => {
        if (k === entity.props.name) {
          entity.onStoreChange();
        }
      });
    });
  };

  submit = () => {
    console.log(
      "%c [  ]-60",
      "font-size:13px; background:pink; color:#bf2c9f;"
    );
    // todo
    // validate
    // 根据校验结果，判断执行onFinish, onFinishFailed,

    const {onFinish, onFinishFailed} = this.callbacks;

    let err = [];
    // ? 作业：实现 validate {err:'请输入...'}
    if (err.length === 0) {
      onFinish(this.getFieldsValue());
    } else {
      onFinishFailed(err, this.getFieldsValue());
    }
  };

  getForm = () => {
    return {
      setFieldsValue: this.setFieldsValue,
      getFieldValue: this.getFieldValue,
      getFieldsValue: this.getFieldsValue,
      registerFieldEntity: this.registerFieldEntity,
      submit: this.submit,
      setCallbacks: this.setCallbacks,
    };
  };
}

export default function useForm(form) {
  // 在组件卸载之前，这个对象存在某个地方

  const formRef = useRef();
  if (!formRef.current) {
    if (form) {
      formRef.current = form;
    } else {
      const formStore = new FormStore();
      formRef.current = formStore.getForm();
    }
  }

  return [formRef.current];
}
