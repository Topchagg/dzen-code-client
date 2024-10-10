import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDataStore } from '../../zustand/zustand';

import CommentForm from '../../forms/commentForm/commentForm';
import Comment from '../../entities/comment/comment';
import useFetch from '../../shared/customHooks/useFetch';
import LoadingItem from '../../shared/ui/loadingItem/loadingitem';
import { CommentType } from '../../entities/comment/api/commentarType';

import './ui/commentariesPage.css';

const CommentariesPage = () => {
    const [params] = useSearchParams();
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const isChanged = useDataStore((state) => state.isChanged);

    const [page, setPage] = useState<string | null>(params.get("page"));
    const [data, setData] = useState<any | []>();
    const comments = useFetch("https://dzen-code-server-32421357bff6.herokuapp.com/message/?page=" + page, [isChanged]);

    useEffect(() => {
        setData(JSON.parse(comments?.data)); // Сохраняю подгруженные данные с сервера
        if (comments.data) {
            setIsLoaded(true);
        }
    }, [comments]);

    const IncrementPage = () => { 
        if (page && data.next) {
            const incrementedPage = Number.parseInt(page) + 1;
            setPage(JSON.stringify(incrementedPage));
        }
    };

    const DecrementPage = () => {
        if (page && data.previous) {
            const intPage = Number.parseInt(page);
            if (intPage > 1) {
                setPage(JSON.stringify(intPage - 1));
            }
        }
    };

    useEffect(() => {
        console.log(comments)
    },[comments])

    if (!comments.loading) {
        return (
            <div className="content-wrapper">
                <div className="title s-margin">Commentaries</div>
                <div className="commentaries-wrapper s-margin">
                    {data?.results.map((item: CommentType, key: number) => (
                            <Comment {...item} key={key} />
                        ))}
                    <div className="pagination-btns">
                        <Link to={"/main?page=" + page}>
                            <span onClick={DecrementPage} className='is-clickable'>{"<"}</span>
                        </Link>
                        <Link to={"/main?page=" + page}>
                            <span onClick={IncrementPage} className='is-clickable'>{">"}</span>
                        </Link>
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
