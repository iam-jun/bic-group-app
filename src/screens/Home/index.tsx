import React from 'react';
import {useDispatch} from 'react-redux';

import {homeStack} from '~/configs/navigator';
import {NavigationHeader, ViewSpacing} from '~/components';
import {spacing} from '~/theme';
import * as actions from '~/store/comment/actions';
import {StyleSheet, View} from 'react-native';
import commonActions, {IAction} from '~/constants/commonActions';
import {options} from '~/constants/postOptions';
import CRUDListView from '~/components/list/CRUDListView';
import PostOptionsModal from '~/components/fragments/optionModals/PostOptions';
import {IOption} from '~/interfaces/IOption';
import {IOptionModal} from '~/components/modals/OptionModal';

const Home = ({navigation}: {navigation: any}) => {
  const dispatch = useDispatch();
  const postOptionsModalRef = React.useRef<IOptionModal>();

  const _onItemPress = () => {
    dispatch(actions.getComments());
    navigation.navigate(homeStack.postDetail);
  };

  const _onActionPress = (action: IAction) => {
    switch (action) {
      case commonActions.reactionComment:
        dispatch(actions.getComments());
        navigation.navigate(homeStack.postDetail, {commentFocus: true});

      case commonActions.openPostOption:
        return postOptionsModalRef.current?.open();
    }
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

  return (
    <View>
      <NavigationHeader title="News Feed" rightIcon="iconSearch" />
      <CRUDListView
        style={styles.container}
        listType="content"
        dataType="newsfeed"
        onItemPress={_onItemPress}
        onActionPress={_onActionPress}
        renderItemSeparator={() => <ViewSpacing height={spacing.margin.base} />}
      />
      <PostOptionsModal ref={postOptionsModalRef} onMenuPress={onMenuPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.padding.base,
  },
});

export default Home;
