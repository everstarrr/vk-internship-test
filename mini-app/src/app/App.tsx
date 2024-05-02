import {View, SplitLayout, SplitCol} from '@vkontakte/vkui';
import {useActiveVkuiLocation} from '@vkontakte/vk-mini-apps-router';
import {Home} from '../pages';
import {DEFAULT_VIEW_PANELS} from './routes.ts';
import {NewsPage} from "../pages/NewsPage/NewsPage.tsx";

export const App = () => {


    const {panel: activePanel = DEFAULT_VIEW_PANELS.HOME} = useActiveVkuiLocation();


    return (
        <SplitLayout>
            <SplitCol>
                <View activePanel={activePanel}>
                    <Home id="home"/>
                    <NewsPage id="news"/>
                </View>
            </SplitCol>
        </SplitLayout>
    );
};
