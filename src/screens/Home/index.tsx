import React from 'react';
import {useDispatch} from 'react-redux';
import {homeStack} from '~/configs/navigator';
import {ViewSpacing} from '~/theme/components';
import ListView from '~/theme/components/List/ListView';
import {spacing} from '~/theme/configs';
import {data} from './dummy-data';
import * as actions from '~/store/comment/actions';
import {StyleSheet} from 'react-native';
import commonActions, {IAction} from '~/constants/commonActions';

// TODO: need to use redux to get data
// Temp: using dummy-data to render newsfeed

const Home = ({navigation}: {navigation: any}) => {
  const dispatch = useDispatch();

  const _onItemPress = () => {
    dispatch(actions.getComments());
    navigation.navigate(homeStack.postDetail);
  };

  const _onActionPress = (action: IAction) => {
    switch (action) {
      case commonActions.reactionComment:
        navigation.navigate(homeStack.postDetail, {commentFocus: true});
    }
  };

  return (
    <ListView
      style={styles.container}
      type="content"
      data={data}
      onItemPress={_onItemPress}
      onActionPress={_onActionPress}
      renderItemSeparator={() => <ViewSpacing height={spacing.margin.base} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.padding.base,
  },
});

export default Home;
