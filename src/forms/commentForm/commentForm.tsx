import { useEffect, useState } from "react"

import { useCreateForm,ReactiveForm, InputField
    , fieldSettings
    ,setGlobalObject
    ,useActionOnSubmit
    ,formIsValid 
    ,FileField,
    getFormValues,
    rawSetter,
} from "reactive-fast-form" // Это моя библиотека :)

import usePost from "../../shared/customHooks/usePost"

import LoadingItem from "../../shared/ui/loadingItem/loadingitem"
import { useDataStore,useJwtStore } from "../../zustand/zustand"

import { deleteFile, downloadFileTo } from "../../firebase/firebaseScripts"
import Signal from "../../shared/ui/signal/signal"
import checkTags from "../../shared/Functions/checkTags"


import './ui/commentForm.css'


const CommentForm = () => {

    const answerTo = useDataStore((state:any) => state.answerTo) // Даёт понять - является ли это ответом или же новым комментарием
    const username = useDataStore((state:any) => state.username) // Даёт понять - является ли это ответом или же новым комментарием
    const isAnswer:boolean = useDataStore((state:any) => state.isAnswer) // Даёт понять - является ли это ответом или же новым комментарием
    const setNullAnswer = useDataStore((state:any) => state.setNullAnswer) // Функция которая сбрасывает данные ответа 
    const setIsChanged = useDataStore((state:any) => state.setIsChanged)
    const setCreatedAnswers = useDataStore((state:any) => state.setCreatedAnswers)
    const [file,setFile] = useState<string>('')

    // 1. answerTO/username/isAnswer -> объеденить всё в один объект

    const jwt = useJwtStore((state:any) => state.jwt) // jwt для проверки на право создание

    const [form,setForm,trigger] = useCreateForm(["text","file"]) // Тут я создаю объект, функцию и триггер , они нужные для работы библиотеки


    const {isOk,data,loading,error,postData} = usePost("https://dzen-code-server-32421357bff6.herokuapp.com/message/")

    const settings:fieldSettings = { // Настройки для field's
        invalidClass: "invalid input",
        validClass: "valid input",
        dynamicStyles:true
    }

    useEffect(() => {
    if (isOk && data){
        if (!isAnswer){
            setIsChanged()
        }else { // Создание локального ответа
            setCreatedAnswers(
                {...data.result,
                answerTo:answerTo,
                isAnswer:isAnswer,
                image:file,
                isLocal:true // Указываю, что этот созданный комментарий является "Локально созданным", а не загруженным с сервера
                },
            )
            setNullAnswer()
            rawSetter(setForm,'file','',true)// Очищение глобального объекта (Чтоб не передавалось на другие созданные коменты)
            setFile('') // Очищаю ссылку на созданный элемент
        }
    }else if (!isOk){
        deleteFile(file) // Удаляю файл с облачного хранилища если создание не закончилось успехом
        setFile('') // Очистка и удаление файла - если не вышло сохранить в базе данных
        rawSetter(setForm,'file','',true)// Очищение глобального объекта (Чтоб не передавалось на другие созданные коменты)
    }
    },[data,isOk])
    

    useActionOnSubmit(async () => { // Это кастомный хук - подобие useEffect он отрабатывает когда изменяется globalObject на данный момент это form
        // в дальнейшем useActionOnSubmit и FormIsValid будут одним целым (Но это уменьшит гибкость :( )
        if(formIsValid(form)){ // FormIsValid -> Проверяет являются ли все значения в form валидными
            let urlLink = null;
            if (form['file'].value){ // Если есть file -> гружу его в облачное хранилище
                urlLink = await downloadFileTo(form['file'].value,'files/')
                setFile(urlLink) // Сохраняю ссылку для предположительного удаления если не удастся выполнить postData
            }
            postData({
                ...getFormValues(form), // getFormValue просто возвращает значения с глобального объекта в виде {key:value} игнорируя isValid
                isAnswer:isAnswer, 
                answerTo: Number.parseInt(answerTo),
                file:urlLink
            },{
                headers:{
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${jwt}`,
            }})
        }
    },trigger) // trigger здесь должен быть, без него не будет отрабатывать useAction соответственно этот кастомный хук базируется на useEffect
    // а trigger это его зависимость

    const handleOnDeleteFile = () => { // rawSetter используется для прямой манипуляции с глобальным объектом object
        rawSetter(setForm,'file','',true)  // Очищаю file
    }

    return (
        <div>   
            {loading && <LoadingItem/>}
            {error && <div className="title">Oups here's some error</div>}
            {form['file'].value &&  // При выборе файла - показываю сообщение
            <Signal isError={false} 
            message={`Вы выбрали: ${form['file'].value?.name}`}
            callBack={handleOnDeleteFile}
            />}
            <ReactiveForm setObject={form} setFunc={setForm}> 
                <div className="fields-wrapper">
                    <div className="input-field-wrapper">
                    {answerTo && username && <div className="is-answer">Ви відповідаєте {username}  <span onClick={setNullAnswer} className="is-clickable">X</span></div> }
                        <InputField
                        name="text" // name один из списка при использовании useCreateForm
                        isTextArea // Определение что это textArea
                        placeholder="Enter text"
                        {...settings}
                        validFunc={checkTags} // callBack valid func
                        min={2} // минимальное кол-во символов
                        max={500} // максимальное кол-во символов
                        isTrigger // Этот пропс должен быть у ОДНОГО из филдов, без него не будет работать useAction
                        resetAfterSubmit // Удаление локальных данных после подтверждения
                        backToTrueIn={3000} // Спустя 3 секунды возвращается в положение True (Чисто стили)
                        />
                    </div>
                    <div>
                        <label htmlFor="file"> 
                            <div className="image-field">
                                <img className="img is-clickable" src="screpka.png" alt="" />
                                <FileField
                                name="file" // имя
                                id="file" // ID непосредственно лейбла который за это отвечает
                                updateOnChange // Обновлять глобальное состояние при обновлении. Единствнный минус - нельзя выбрать два раза
                                // подряд один и тот же самый элемент
                                allowNull // Обозначение необязательного поля
                                types={[
                                    {typeName:'image/',maxSize:100,typeSize:"mbytes"}, // Данные о файле (Какой файл можно сетить)
                                    {typeName:'text/plain',maxSize:100,typeSize:"kbytes"}]} // Данные о файле (какой файл можно сетить)
                                />
                            </div>
                        </label>
                    </div>
                </div>
                <div className="default-btn s-margin" onClick={() => setGlobalObject(setForm)}>Leave comment</div>
            </ReactiveForm>
        </div>
    )
}

export default CommentForm