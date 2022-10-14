import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import notiStack from '~/router/navigator/MainStack/stacks/notiStack/stack';
import commonStack from '~/router/navigator/commonStack/stack';
import articleStack from './stacks/articleStack/stack';

const mainTabStack = {
  ...groupStack,
  ...homeStack,
  ...menuStack,
  ...notiStack,
  ...commonStack,
  ...articleStack,
};

export default mainTabStack;
