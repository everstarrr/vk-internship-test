import {FC, useEffect, useState} from 'react';
import {Card, Group, NavIdProps, Panel, PanelHeader, PanelHeaderBack, Spinner} from '@vkontakte/vkui';
import {useParams, useRouteNavigator} from '@vkontakte/vk-mini-apps-router';
import axios from "axios";
import './ui/newspage.css'
import {CommentTree} from "../../widgets/CommentTree/CommentTree.tsx";

const newsItemURL = 'https://hacker-news.firebaseio.com/v0/item/'

export interface INews {
    id: number
    url: string,
    title: string,
    time: number,
    by: string,
    kids: number[],
    kids_count: number,
    text?: string
}

export const NewsPage: FC<NavIdProps> = ({id}: NavIdProps) => {
    useEffect(() => {
        fetchNews()
    }, []);

    const [news, setNews] = useState<INews>()
    const newsId = useParams<'id'>()
    const fetchNews = async () => {

        await axios.get(`${newsItemURL}${newsId?.id}.json`)
            .then(response => {
                response.data.kids_count=response.data.kids.length
                console.log(response)
                setNews(response.data)
            })
            .catch(e => console.log(e))
    }
    console.log(newsId)
    const routeNavigator = useRouteNavigator();


    return (
        <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()}/>}/>
            {news ?
            <Group>
                <Card className={'card'}>
                    <span>URL: {news.url}</span>
                    <span>TITLE: {news.title}</span>
                    <span>DATE: {new Date(news.time * 1000).toLocaleTimeString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}</span>
                    <span>AUTHOR: {news.by}</span>
                    <span>COMMENTS: {news.kids_count}</span>
                </Card>
            </Group>
                : <Spinner size="large" style={{ margin: '20px 0' }} />}

            {/*{news?*/}
            {/*<CommentTree root={news}/>*/}
            {/*    : <Spinner size="large" style={{ margin: '20px 0' }} />}*/}
        </Panel>
    );
};
