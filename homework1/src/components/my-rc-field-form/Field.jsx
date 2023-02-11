import React, { useContext, useEffect, useMemo, useReducer, useRef } from "react";
import {formContext} from "./context"

// 不知道为啥这种不太行！
// export function Field(props) {
//     const form = useContext(formContext);
//     const [_, forceUpdate] = useReducer((x) => x + 1);
//     const cleanRef = useRef();

//     useMemo(() => {
//         cleanRef.current = form.subscribe(props.name, forceUpdate);
//     }, [forceUpdate])

//     useEffect(() => {
//         return () => cleanRef.current();
//     }, [])


//     function getControl () {
//         return {
//             onChange: (e) => {
//                 form.setFieldsValue({[props.name]: e.target.value});
//             },
//             value: form.getFieldValue(props.name) 
//         }
//     }

//     return React.cloneElement(props.children, getControl());
// }

export class Field extends React.Component {
    static contextType = formContext

    componentDidMount() {
        this.dispose = this.context.subscribe(this.props.name,this.props.rules, this.forceUpdate.bind(this));
    }

    componentWillUnmount() {
        this.dispose();
    }

    getControlled() {
        return {
            onChange: (e) => {
                this.context.setFieldsValue({[this.props.name]: e.target.value});
            },
            value: this.context.getFieldValue(this.props.name) 
        }
    }

    render() {
        return React.cloneElement(this.props.children, this.getControlled()); 
    }
}