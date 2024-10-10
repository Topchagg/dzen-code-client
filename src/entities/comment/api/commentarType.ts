

type CommentType = {
    id:string,
    isAnswer:boolean,
    owner:{email:string,username:string,pk:number},
    text:string,
    file?:string,
    answerTo?:number,
    hasAnswers:boolean,
    amountOfAnswers:number,
    isLocal?:true
    setFunc?:any,
    setLocalFunc?:any
}

export type {CommentType}