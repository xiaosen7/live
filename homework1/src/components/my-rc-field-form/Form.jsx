import React from "react"
import { useForm } from "./useForm";
import {formContext} from "./context";

export const Form = React.forwardRef((props, ref) => {
    const [formInstance] = useForm(props.form);

    React.useImperativeHandle(ref, () => formInstance);
    
    return <form onSubmit={((e) => {
        e.preventDefault();
        formInstance.submit((values) => {
            console.log(values);
        }, (error) => {
            console.error(error);
        });
    })}>
        <formContext.Provider value={formInstance}>
            {props.children}
        </formContext.Provider>
    </form>
})