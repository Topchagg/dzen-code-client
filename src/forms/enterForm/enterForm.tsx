import { useEffect } from "react"
import { 
    useCreateForm, 
    ReactiveForm, 
    InputField, 
    fieldSettings, 
    setGlobalObject, 
    useActionOnSubmit, 
    formIsValid, 
    getFormValues 
} from "reactive-fast-form" // Это моя библиотека - больше описаний в файле forms/CommentForm/CommentForm.ts

import usePost from "../../shared/customHooks/usePost"
import { useJwtStore } from "../../zustand/zustand"
import LoadingItem from "../../shared/ui/loadingItem/loadingitem"

const EnterForm = () => {
    const setJwt = useJwtStore((state: any) => state.setJwt)

    const [form, setForm, trigger] = useCreateForm(["username", "password"])

    const settings: fieldSettings = { 
        validClass: "input valid",
        invalidClass: "input invalid",
        dynamicStyles: true
    }

    const { isOk, data, loading, error, postData } = usePost('https://dzen-code-server-32421357bff6.herokuapp.com/api/token/')

    const handleSubmit = (body: object) => {
        postData(body)
    }

    useActionOnSubmit(() => {
        if (formIsValid(form)) {
            handleSubmit(getFormValues(form)) 
        }
    }, trigger)

    useEffect(() => {
        console.log(data)
        if (isOk && data) {
            setJwt(data?.['access']) 
            localStorage.setItem("jwt",data?.['access']) // Сохраняю данные в localStorage
            localStorage.setItem("id",data?.['userId'])// Сохраняю данные в localStorage, вроде как сайтецкий устойчив к xss - хотя не могу быть в этом уверен
        }
    }, [isOk, data, setJwt])

    return (
        <>  
            {loading && <LoadingItem />}  
            <ReactiveForm setFunc={setForm} setObject={form}>
                <div className="input-wrapper">
                    {!form.username.isValid && <div className="error-text"><strong>Логин некорректен</strong></div> }
                    <InputField 
                        name="username"
                        isTrigger
                        {...settings}
                        placeholder="Username"
                    />
                </div>
                <div className="input-wrapper xs-margin">
                    {!form.password.isValid && <div className="error-text"><strong>Пароль некорректен</strong></div> }
                    <InputField
                        name="password"
                        placeholder="Password"
                        {...settings}
                    />
                </div>
                <div className="default-btn s-margin" onClick={() => setGlobalObject(setForm)}>
                    Enter
                </div>
            </ReactiveForm>
        </>
    )
}

export default EnterForm
