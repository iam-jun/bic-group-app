import groupScreens from '~/router/navigator/MainStack/stacks/groupStack/screens';
import homeScreens from '~/router/navigator/MainStack/stacks/homeStack/screens';
import menuScreens from '~/router/navigator/MainStack/stacks/menuStack/screens';
import notiScreens from '~/router/navigator/MainStack/stacks/notiStack/screens';
import commonScreens from '~/router/navigator/commonStack/screens';
import articleScreens from './stacks/articleStack/screens';
import seriesScreens from './stacks/series/screens';

const mainTabScreens: any = {
  ...groupScreens,
  ...homeScreens,
  ...menuScreens,
  ...notiScreens,
  ...commonScreens,
  ...articleScreens,
  ...seriesScreens,
};

export default mainTabScreens;
