import {FC, useEffect, useState} from 'react';
import {
    Panel,
    Header,
    Button,
    Group,
    Div,
    NavIdProps, CardGrid, ContentCard,
} from '@vkontakte/vkui';
import {useRouteNavigator} from '@vkontakte/vk-mini-apps-router';
import axios from "axios";

export type NewsItem = {
    id: number
    title: string,
    score: number,
    by: string,
    time: number
}

const newStoriesURL = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty'
const newsItemURL = 'https://hacker-news.firebaseio.com/v0/item/'

//export interface HomeProps extends NavIdProps {
//}

export const Home: FC<NavIdProps> = ({id}) => {

    const [newsData, setNewsData] = useState<NewsItem[]>([]);
    const [isFetching, setIsFetching] = useState<Boolean>(false) // мб не надо

    // Сортировка массива по полю time
    const sortNews = (newElement: NewsItem, sortedArray: NewsItem[]) => {
        let left = 0;
        let right = sortedArray.length - 1;
        let insertIndex = -1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);

            if (newElement.time <= sortedArray[mid].time) {
                left = mid + 1;
            } else {
                right = mid - 1;
                insertIndex = mid;
            }
        }
        sortedArray.splice(insertIndex === -1 ? sortedArray.length : insertIndex, 0, newElement);
    }

    // TODO: прерывать предыдущий запрос при нажатии на кнопку

    // GET-запрос к серверу
    const fetchData = async () => {
        console.log(isFetching)

        const response = await axios.get(newStoriesURL); // массив id новостей
        const newsIds = response.data.slice(0,100)
        setNewsData([])

        for (let id of newsIds) { //вот этот цикл надо прерывать

            if (isFetching) { // работает хуево
                console.log(isFetching)
                break
            }

            await axios.get(`${newsItemURL}${id}.json`) // запрос для получения новости
                .then(newsItem =>
                    setNewsData(prevState => {
                        const newData = [...prevState]
                        //console.log(newData)
                        sortNews(newsItem.data, newData)
                        return newData
                    })
                )
        }
    };

    const handleClick = () => { //работает хуево
        setIsFetching(true)
    }

    useEffect(() => {
        fetchData().catch(error => {
            console.log(error)
        });
        const interval = setInterval(fetchData, 60000); // Запрос каждые 60 секунд

        return () => clearInterval(interval); // Очистить интервал при размонтировании компонента
    }, [isFetching]); // хз нужна ли тут зависимость


    const routeNavigator = useRouteNavigator();

    return (
        <Panel id={id}>
            <Group header={<Header mode="secondary">Перезагрузить</Header>}>
                <Div>
                    <Button stretched size="l" mode="secondary" onClick={() => handleClick()}>
                        ПЕРЕЗАГРУЗИТЬ
                    </Button>
                </Div>
            </Group>
            <Group>
                {newsData.map(newsItem => (
                    <CardGrid size='l' key={newsItem.id}>
                        <ContentCard
                            onClick={() => routeNavigator.push(`/news/${newsItem.id}`)}
                            header={newsItem.title}
                            subtitle={newsItem.score}
                            text={newsItem.by}
                            caption={new Date(newsItem.time * 1000).toLocaleTimeString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        />
                    </CardGrid>
                ))}
            </Group>
        </Panel>
    );
};
