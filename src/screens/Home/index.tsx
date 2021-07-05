import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {homeStack} from '~/configs/navigator';
import {NavigationHeader, ScreenWrapper, ViewSpacing} from '~/components';
import {spacing} from '~/theme';
import * as actions from '~/store/comment/actions';
import {StyleSheet, View} from 'react-native';
import commonActions, {IAction} from '~/constants/commonActions';
import CRUDListView from '~/components/list/CRUDListView';
import {IObject} from '~/interfaces/common';

const Home = ({navigation}: {navigation: any}) => {
  const dispatch = useDispatch();

  const _onItemPress = () => {
    dispatch(actions.getComments());
    navigation.navigate(homeStack.postDetail);
  };

  const _onActionPress = (action: IAction) => {
    switch (action) {
      case commonActions.reactionComment:
        dispatch(actions.getComments());
        navigation.navigate(homeStack.postDetail, {commentFocus: true});
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.padding.base,
  },
});

export default Home;
