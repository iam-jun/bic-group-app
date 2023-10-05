import groupScreens from '~/router/navigator/MainStack/stacks/groupStack/screens';
import homeScreens from '~/router/navigator/MainStack/stacks/homeStack/screens';
import menuScreens from '~/router/navigator/MainStack/stacks/menuStack/screens';
import notiScreens from '~/router/navigator/MainStack/stacks/notiStack/screens';
import commonScreens from '~/router/navigator/commonStack/screens';
import articleScreens from './stacks/articleStack/screens';
import seriesScreens from './stacks/series/screens';
import topicScreens from './stacks/topic/screens';
import tagsScreens from './stacks/tagsStack/screens';
import ConfirmUser from '~/screens/auth/VerifyEmail/ConfirmUser';
import quizScreens from './stacks/quizStack/screens';
import searchScreens from './stacks/searchStack/screens';

const mainTabScreens: any = {
  ...groupScreens,
  ...homeScreens,
  ...menuScreens,
  ...notiScreens,
  ...commonScreens,
  ...articleScreens,
  ...seriesScreens,
  ...topicScreens,
  ...tagsScreens,
  ...quizScreens,
  ...searchScreens,
  'confirm-user': ConfirmUser,
};

export default mainTabScreens;
