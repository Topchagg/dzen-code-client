import { create } from "zustand";

import { CommentType } from "../entities/comment/api/commentarType";

interface createdAnswers  {
    id:number[],
    [x:string]: {}
}

interface useDataStore {
    createdAnswers:createdAnswers, // Локально созданные ответы
    answerTo:number|false, // Элемент который помогает определить кому отвечает новосозданный комментарий (Если отвечает)
    username:string|false, // Элемент который помогает определить кому отвечает новосозданный комментарий (Если отвечает)
    isAnswer:boolean, // Элемент который помогает определить кому отвечает новосозданный комментарий (Если отвечает)
    isChanged:boolean, // Отслеживает сохранение что перефетчить на главной странице данные
    localDeletedMessages:any, // Локально удаленные сообщения которые хранятся в виде {id:amountOfDeleted:number}
    deletedMessages: number[], // айдишники удаленных комментариев, чтоб не перефетчивать и не вызывать рендер
    // сохраняю их в списке а потом по фильртации вывожу, ну или же нет
    hasAnswers: {[x:string]:boolean},
    deletedAnswers: any,
    setIsAnswer: (newAnswerTo:string,newUserName:string) => void, // Установка элементов для определния ответ это или же нет
    setNullAnswer: () => void, // Отмена элементов определения ответ это или же нет
    setIsChanged: () => void, // Тригер который и вызывает перефетч на главной странице
    setCreatedAnswers: (commet:CommentType) => void, // Сохраняет локально созданные комментарии
    setDeletedMessages: (id:number) => void, // Сохраняет локально удаленные комментарии, а точнее их айдишники
    removeCreatedAnswer: (id:number) => void, // Удаляет локально созданный комментарий
    setLocalDeletedMessages: (deletedAnswer:CommentType,isLocal:boolean) => void, // Сохраняет кол-во удаленных локальных сообщений
    setHasAnswers: (isHasAnswers:boolean,id:string) => void
}

const useJwtStore =  create((set) => ({
    jwt:null,
    setJwt: (newJwt:string) => set({jwt:newJwt})
}))

const useDataStore = create<useDataStore>((set) => ({
    createdAnswers: { id: [] }, // Для ответов 
    deletedMessages: [], // Для сообщений. Это можно было бы объединить, но количество спредов увеличивается,
    answerTo: false,
    username: false,
    isAnswer: false,

    isChanged: false,

    deletedAnswers:{},

    hasAnswers: {},
    setHasAnswers: (isHasAnswers:boolean,id:string) => set((state) => {
       const newObject = {...state.hasAnswers}
       newObject[id] = isHasAnswers
       return {hasAnswers:newObject}
    }),

    setLocalDeletedMessages: (answerTo:number) => set((state) => {
        const objectToSave = {...state.localDeletedMessages}

        if(!objectToSave[answerTo]){
            objectToSave[answerTo] = 1;
        }else {
            objectToSave[answerTo] = objectToSave[answerTo] + 1
        }

        return {localDeletedMessages:objectToSave}
        
    }),
    setDeletedMessages: (id) => set((state) => ({ deletedMessages: [...state.deletedMessages, id] })),
    setIsChanged: () => set((state) => ({ isChanged: !state.isChanged,prevIsChanged:state.isChanged })),
    
    setIsAnswer: (newAnswerTo: string, newUserName?: string) => 
        set({ answerTo: newAnswerTo, username: newUserName, isAnswer: true }),

    setNullAnswer: () => set({ answerTo: false, username: false, isAnswer: false }),

    setCreatedAnswers: (newAnswer: CommentType | null) => 
        set((state) => {
            const objectToSave = { ...state.createdAnswers }; 
            
            if (!objectToSave[newAnswer.answerTo]) {
                objectToSave[newAnswer.answerTo] = [];
            }

            objectToSave[newAnswer.answerTo].push(newAnswer);
            objectToSave.id.push(newAnswer.id);

            return { createdAnswers: objectToSave }; 
        }),

    removeCreatedAnswer: (id: number) => 
        set((state) => {
            const updatedCreatedAnswers = { ...state.createdAnswers }; 

            Object.keys(updatedCreatedAnswers).forEach((answerTo) => {
                updatedCreatedAnswers[answerTo] = updatedCreatedAnswers[answerTo].filter(
                    (comment: CommentType) => comment.id !== id
                );
            });

            const updatedIds = state.createdAnswers.id.filter((existingId) => existingId !== id);

            return { createdAnswers: { ...updatedCreatedAnswers, id: updatedIds } };
        }),
}));

export {useJwtStore}
export {useDataStore}