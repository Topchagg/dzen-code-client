import { useEffect, useState } from 'react';
import { useDataStore } from '../../zustand/zustand';

import CommentForm from '../../forms/commentForm/commentForm';
import Comment from '../../entities/comment/comment';
import useFetch from '../../shared/customHooks/useFetch';
import LoadingItem from '../../shared/ui/loadingItem/loadingitem';
import { CommentType } from '../../entities/comment/api/commentarType';

import './ui/commentariesPage.css';

const CommentariesPage = () => {

    const isChanged = useDataStore((state) => state.isChanged);

    const [page, setPage] = useState<number>(1);
    const [data, setData] = useState<any | []>();
    const comments = useFetch("https://dzen-code-server-32421357bff6.herokuapp.com/message/?page=" + page, [isChanged]);

    useEffect(() => {
        setData(JSON.parse(comments?.data)); // Сохраняю подгруженные данные с сервера
        if (comments.data) {
        }
    }, [comments]);

    const IncrementPage = () => { 
        if (page && data.next) {
            setPage(prev => prev + 1)
        }
    };

    const DecrementPage = () => {
        if (page && data.previous) {
            setPage(prev => prev - 1)
        }
    };

    if (!comments.loading) {
        return (
            <div className="content-wrapper">
                <div className="title s-margin">Commentaries</div>
                <div className="commentaries-wrapper s-margin">
                    {data?.results.map((item: CommentType, key: number) => (
                            <Comment {...item} key={key} />
                        ))}
                    <div className="pagination-btns">
                        <span onClick={DecrementPage} className='is-clickable'>{"<"}</span>
                        <span onClick={IncrementPage} className='is-clickable'>{">"}</span>
                    </div>
                </div>
                <div className="form-comment-wrapper s-margin">
                    <CommentForm />
                </div>
            </div>
        );
    } else {
        return <LoadingItem />; 
    }
};

export default CommentariesPage;
