import { useCreateForm,ReactiveForm,InputField,fieldSettings, setGlobalObject,useActionOnSubmit,formIsValid, getFormValues } from "reactive-fast-form";

import {isEmail} from "validator"

import usePost from "../../shared/customHooks/usePost";


import './ui/regestrationForm.css'
import LoadingItem from "../../shared/ui/loadingItem/loadingitem";

const RegestrationForm = () => {

    const [form,setForm,trigger] = useCreateForm(["email","username","password"])

    const settings:fieldSettings = {
        validClass:"input valid",
        invalidClass:"input invalid",
        dynamicStyles:true
    }

    const {isOk, data, loading, error, postData } = usePost('https://dzen-code-server-32421357bff6.herokuapp.com/user/');

    const CreateAcc = (body:object) => {
        postData(body)
    }

    useActionOnSubmit(() => {
        if(formIsValid(form)){
            CreateAcc(getFormValues(form))
        }
    },trigger)

    return (
        <>
            <div>
            {isOk && <div className="title text-center">Created!</div>}
            {loading && <LoadingItem/>}
            {error && <div>{error}</div>}
                <ReactiveForm setFunc={setForm} setObject={form}>
                    <div className="input-wrapper">
                        {!form.username.isValid && <div className="error-text"><strong>Имя некорректно</strong></div> }
                        <InputField 
                        name="username"
                        isTrigger
                        {...settings}
                        placeholder="username"
                        />
                    </div>
                    <div className="input-wrapper xs-margin">
                        {!form.email.isValid && <div className="error-text"><strong>Почта некорректна</strong></div> }
                    <InputField
                        name={"email"}
                        validFunc={isEmail}
                        {...settings}
                        placeholder="Email"
                        />
                    </div>
                    <div className="input-wrapper xs-margin">
                        {!form.password.isValid && <div className="error-text"><strong>Пароль некорректен</strong></div> }
                        <InputField
                        name="password"
                        placeholder="password"
                        {...settings}
                        />
                    </div>
                    <div className="default-btn s-margin" onClick={() => setGlobalObject(setForm)}>Regestration</div>
                </ReactiveForm>
            </div>
        </> 
    )
}

export default RegestrationForm