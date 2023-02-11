export class FormStore {
  store = {};
  subscriptions = {};
  rules = {};

  getFieldValue(name) {
    return this.store[name];
  }

  setFieldsValue(values) {
    this.store = {
      ...this.store,
      ...values,
    };

    Object.keys(values).forEach((name) => {
      const callback = this.subscriptions[name];
      if (callback) {
        callback();
      }
    });
  }

  subscribe(name, rules, callback) {
    this.subscriptions[name] = callback;
    this.rules[name] = rules;
    return () => {
      delete this.subscriptions[name];
      delete this.rules[name];
      delete this.store[name];
    };
  }

  submit(onSuccess, onError) {
    const names = Object.keys(this.rules);
    const nameToError = {};
    for (let index = 0; index < names.length; index++) {
      const name = names[index];
      const value = this.store[name];
      const nameRules = this.rules[name];

      for (let ri = 0; ri < nameRules.length; ri++) {
        const rule = nameRules[ri];
        if (rule.required && (value == null || value === "")) {
          nameToError[name] = rule.message;
          break;
        }
      }
    }

    if (Object.keys(nameToError).length === 0) {
      onSuccess({ ...this.store });
    } else {
      onError(nameToError);
    }
  }
}
