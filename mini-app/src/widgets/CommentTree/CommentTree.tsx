import {FC, useEffect, useState} from "react";
import axios from "axios";
import {INews} from "../../pages/NewsPage/NewsPage.tsx";

interface ICommentTreeProps{
    root: INews
}

export const CommentTree: FC<ICommentTreeProps> = ({root}) => {

    const [comments, setComments] = useState<INews[]>([root]);

    useEffect(() => {
        // Получаем потомков для каждого комментария
        const fetchComments = async (comment:INews) => {
            if (comment.kids) {
                const kids = await Promise.all(
                    comment.kids.map((id:number) => fetchComment(id))
                );
                setComments((prevComments) => [
                    ...prevComments,
                    ...kids,
                ]);
            }
        };

        // Рекурсивно получаем потомков для всех комментариев
        const fetchComment = async (id:number) => {
            const response = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            const comment = await response.data();
            await fetchComments(comment);
            return comment;
        };

        fetchComments(root);
    }, [root]);

    // Рендеринг дерева комментариев
    const renderComment = (comment:INews) => {
        console.log(comment)
        return (
            <div key={comment.id}>
                {comment.text}
                {(comment.kids) &&
                    comment.kids.map((id) =>
                        // @ts-ignore
                        renderComment(comments.find((c) => c.id === id)))}
            </div>
        );
    };

    return <div>{renderComment(root)}</div>;

}