import React, {useContext} from 'react';
import {useDispatch} from 'react-redux';

import ListView from '~/beinComponents/list/ListView';

import {NavigationHeader, ScreenWrapper, ViewSpacing} from '~/components';
import {AppContext} from '~/contexts/AppContext';
import {spacing} from '~/theme';
import {StyleSheet, View} from 'react-native';
import commonActions, {IAction} from '~/constants/commonActions';
import {options} from '~/constants/postOptions';
import PostOptionsModal from '../fragments/PostOptions';
import {IOption} from '~/interfaces/IOption';
import {IOptionModal} from '~/components/modals/OptionModal';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';
import Header from '~/beinComponents/Header';
import images from '~/resources/images';
import Text from '~/beinComponents/Text';
import Avatar from '~/beinComponents/Avatar';
import HeaderCreatePost from '~/screens/Home/Newsfeed/components/HeaderCreatePost';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {data} from './dummy-data';

const Newsfeed = ({navigation}: {navigation: any}): React.ReactElement => {
  const dispatch = useDispatch();
  const postOptionsModalRef = React.useRef<IOptionModal>();

  const theme: ITheme = useTheme();
  const styles = createStyle(theme);

  const _onItemPress = () => {
    // dispatch(actions.getComments());
    // navigation.navigate(homeStack.postDetail);
  };

  const _onActionPress = (action: IAction) => {
    console.log('\x1b[32m', '_onActionPress : ', action, '\x1b[0m');
  };

  const onMenuPress = async (menu: IOption) => {
    switch (menu.type) {
      case options.HIDE:
        console.log('Hide post!');
        break;

      case options.EDIT:
        console.log('Edit post!');
        break;

      case options.DELETE:
        console.log('Delete post!');
        break;
    }
  };

  // const {streamClient} = useContext(AppContext);
  // dispatch(createAction(ActionTypes.GetStreamSample, {streamClient}));
  return (
    <ScreenWrapper isFullView>
      <Header
        avatar={images.logo_bein}
        hideBack
        title={'post:news_feed'}
        titleTextProps={{useI18n: true}}
        icon={images.logo_bein}
      />
      <ListView
        isFullView
        style={styles.container}
        type="content"
        data={data}
        onItemPress={_onItemPress}
        onActionPress={_onActionPress}
        ListHeaderComponent={() => <HeaderCreatePost />}
        renderItemSeparator={() => <ViewSpacing height={spacing.margin.base} />}
      />
      <PostOptionsModal ref={postOptionsModalRef} onMenuPress={onMenuPress} />
    </ScreenWrapper>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      paddingTop: spacing.padding.base,
      backgroundColor: colors.bgDisable,
    },
  });
};

export default Newsfeed;
