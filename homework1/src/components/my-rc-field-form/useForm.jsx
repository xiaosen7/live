import { useRef } from "react"
import { FormStore } from "./FormStore";

export function useForm(form) {
    const formRef = useRef(form);

    if (!formRef.current) {
        formRef.current = new FormStore();
    }

    return [formRef.current]
}