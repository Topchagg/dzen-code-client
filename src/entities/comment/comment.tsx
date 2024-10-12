import { useState, useCallback, useEffect } from 'react';
import { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { CommentType } from './api/commentarType';
import { useDataStore, useJwtStore } from '../../zustand/zustand';
import useDelete from '../../shared/customHooks/useDelete';
import { deleteFile } from '../../firebase/firebaseScripts';

import safeAdd from '../../shared/Functions/saveAdd';

import './ui/comment.css';

// Я взял инстаграмовскую модель поведения комментариев, т.к в ТЗ определение комментариев было одним предложением + скрином - всё
// Надеюсь вы поймёте, почему я не захотел вас доставать лишними вопросами)
// Если сравнить модель поведения инстаграмм комментариев на пк - то мои даже ведут лучше (Нет локального дубликата), хоть это и далось мне толькьо на последний день xD


const Comment: FC<CommentType> = (props) => {
    const [page, setPage] = useState<number>(1); // Страница для подгрузки ответов
    const userID = Number(localStorage.getItem('id')); // Преобразование ID к числу
    const [data, setData] = useState<any>([]); // Храним данные о текущей странице и ссылке next для пагинации
    const [allLoaded, setAllLoaded] = useState<boolean>(false); // Здесь очень много флаг-стейтов, их можно уменьшить, но время у меня закончилось :( 
    const [showAnswers, setShowAnswers] = useState<boolean>(false); // Отвечает за показ комментариев и кнопок открытия-закрытия
    const [amountOfRealAnswers,setAmountOfRealAnswers] = useState<number>(0) // Этот чудо стейт совмещает в себе сбор информации за
    // 1. Удаленные локальные и глобальные (серверные) комментарии. (Под локальными имеется откуда появился этот комментарий на клиенте)
    // т.е если комментарий был подругжен с сервера - он серверный, если создан здесь - локальный, но они все полностью функциональные, что локальные, что серверные
    // 2. Созданные локальные и подргруженные серверные
    // Логика этого стейтка заключается в том, чтоб узнавать какое кол-во ответов на данный момент имеет этот комментарий
    // Если 0 - False соотвтетсвенно нет кнопок открытия закрытия и не выводятся никакие элементы.
    // если > 0 - True - появляются кнопки открытия закрытия и т.д

    const [amountOfDeletedEl,setAmountOfDeletedEl] = useState<number>(0) // Подсчитывает кол-во удаленных элементов

    const isChanged = useDataStore((state) => state.isChanged);

    const jwt = useJwtStore((state: any) => state.jwt); // jwt

    const createdAnswers = useDataStore((state: any) => state.createdAnswers);// Локально созданные экземпляры, которые имеют атрибут isLocal:true
    const removeCreatedAnswer = useDataStore((state) => state.removeCreatedAnswer) // удаление локально-созданного экземпляра

    const setIsAnswer = useDataStore((state: any) => state.setIsAnswer); // Сохраняет ID комментария к которому захотели оставить ответ 

    const setDeletedMessages = useDataStore((state:any) => state.setDeletedMessages) // сохраняет айдишник удаленных комментариев для избежания коллизий и дубликаций

    const deletedMessages = useDataStore((state) => state.deletedMessages) // список удаленных айдишников
    const { deleteItem, loading, error, success } = useDelete('https://dzen-code-server-32421357bff6.herokuapp.com/message/'); // Кастомный хук для удаления

    // Загрузка ответов на комментарии
    const handleOnLoadAnswers = async () => {
        if (!allLoaded) {
            try {
                const response = await fetch(`https://dzen-code-server-32421357bff6.herokuapp.com/answers?page=${page}&messageID=${props.id}`, {
                    method: 'GET',
                });
                
                const result = await response.json();
                
                if (result.next) {  // Определие возможности дальнейшей подгрузки следующих страниц
                    setPage((prev) => prev + 1);
                } else {
                    setAllLoaded(true);
                }

                const existingIds = new Set([ 
                    ...data.map(comment => comment.id), 
                    ...(createdAnswers[props.id] || []).map(answer => answer.id)  // Получаю только уникальные айдишник, чтоб не было дубликации
                ]); 

                const uniqueResults = result.results.filter(comment => !existingIds.has(comment.id));

                setData(prevData => [...prevData, ...uniqueResults]); // Сохраняю данные без дубликаций

                setShowAnswers(true);
            } catch (error) {
                console.error('Error loading answers:', error);
            }
        }
    };

    useEffect(() => {
        if (createdAnswers[props.id]) {
            setShowAnswers(true);
        } // Сразу же показываю локально созданные комментарии игнорируя серверные (Для лучше UX)
    }, [createdAnswers]);

    useEffect(() => {
        if(!props.isAnswer){
            setAmountOfRealAnswers(safeAdd(
                createdAnswers[props.id]?.length,
                data?.length,
                amountOfDeletedEl * (-1), 
                )) // Вот здесь как раз происходит подсчёт кол-ва активных комментариев
                // функция safeAdd - является захардкоженной на 3 элемента, просто у меня не было цели делать её реюзабельной - поэтому вот так
                // (Для реюзабельности можно сделать массив элементов - всё)
        }
    },[data,createdAnswers,amountOfDeletedEl])

    useEffect(() => {
        // Если кол-во активных комментариев больше чем серверные + локальные - значит все загруженные а дальше идут лишь дубликаты локально созданных
        if((amountOfRealAnswers - createdAnswers[props.id]?.length) * -1 == props.amountOfAnswers){ // сихронизация локально-созданных комментариев (могут быть новые баги)
            setAllLoaded(true)
        }else { 
            if (amountOfRealAnswers >= props.amountOfAnswers + createdAnswers[props.id]?.length) { // Проверка на дубликаты
                setAllLoaded(true) 
            }
        }   
    },[amountOfRealAnswers,isChanged])

    useEffect(() => {
        if(success){ // success -> Показывает успешо ли был удален комментарий
            setDeletedMessages(props.id) // Устанавливаю айди удаленного комментария 
            if(props.setFunc && !props.isLocal){
                props.setFunc(prev => prev + 1)
            }
            if(props.isLocal){
                removeCreatedAnswer(Number.parseInt(props.id))
            }
            if(props.file){
                deleteFile(props.file)
            } // Удаление файла с облачного хранилища 
        }
    },[success])

    // Обработка нажатия на "Ответить"
    const handleOnMakeAnswer = useCallback(() => {
        const answerTo = props.isAnswer ? props.answerTo : props.id; // Если это ответ на другой ответ, берем родительский комментарий
        setIsAnswer(answerTo, props.owner.username); // Сохраняем данные о том, кому отвечаем
    }, [props.isAnswer, props.answerTo, props.id, props.owner.username, setIsAnswer]);

    const wrapperStyle = props.isAnswer ? 'answer-wrapper' : 'comment-wrapper'; // Определяю стили обертки
    if(deletedMessages.find((item,index) => item === Number.parseInt(props.id))){
        return 
    }else {
        return (
            <div className={wrapperStyle}>
                {/* Удаление доступно только владельцу комментария */}
                {userID === props.owner.pk && (
                    <div className="is-clickable" onClick={() => deleteItem(props.id, jwt)}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </div>
                )}
    
                <div className="user-nav-bar">
                    <div className="avatar-wrapper"></div>
                    <div className="user-data">
                        <div>{props.owner?.username}</div>
                        <div className="xs-margin">{props.owner?.email}</div>
                    </div>
                </div>
    
                <div className="text-section semi-border">
                    <div className="text-wrapper s-margin" dangerouslySetInnerHTML={{ __html: props.text }}></div>
                </div>
    
                <div className="comment-btns btn is-clickable">
                    <div className="default-btn semi-border make-answer-btn" onClick={handleOnMakeAnswer}>
                        Відповісти
                    </div>
                    {props.file && <a href={props.file} target='_blank'><div>Подивитись вложене</div></a>}
                    {!allLoaded && <>bruh</>}
                </div>
    
                
                {/* Сообщения с сервера */}
                <AnimatePresence>
                    {data && showAnswers && data.map((item: CommentType) => (
                        <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto", overflow: "hidden" }}
                        exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                        transition={{ duration: 0.75 }}
                        >
                            <Comment {...item} key={item.id} setFunc={setAmountOfDeletedEl}/>
                        </motion.div>
                    ))}
    
                    {/* Локально созданные сообщения */}
                    {createdAnswers[props.id] && showAnswers && createdAnswers[props.id].map((item: CommentType, key: number) => (
                        <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto", overflow: "hidden" }}
                        exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                        transition={{ duration: 0.75 }}>
                            <Comment {...item} key={key} setFunc={setAmountOfDeletedEl}/>
                        </motion.div>
                    ))}
                </AnimatePresence>
    
                {props.hasAnswers && !allLoaded &&
                <div className='default-btn s-margin' onClick={handleOnLoadAnswers}>
                    Загрузити коментарі
                </div>}
                {Boolean(amountOfRealAnswers) && !props.isAnswer && <>
                    {showAnswers && 
                    <div className='default-btn s-margin' onClick={() => setShowAnswers(false)}>
                        Закрити коментарі
                    </div>}
                    {!showAnswers &&
                    <div className='default-btn s-margin' onClick={() => setShowAnswers(true)}>
                        Відкрити коментарі
                    </div>}
                </>}
    
                {error && <div className="error-message">Ошибка при удалении: {error}</div>}
            </div>
        );
    }
};

export default Comment;
