import groupScreens from '~/router/navigator/MainStack/stacks/groupStack/screens';
import homeScreens from '~/router/navigator/MainStack/stacks/homeStack/screens';
import menuScreens from '~/router/navigator/MainStack/stacks/menuStack/screens';
import notiScreens from '~/router/navigator/MainStack/stacks/notiStack/screens';

const mainTabScreens: any = {
  ...groupScreens,
  ...homeScreens,
  ...menuScreens,
  ...notiScreens,
}

export default mainTabScreens;
