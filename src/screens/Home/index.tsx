import React from 'react';
import {useDispatch} from 'react-redux';
import {homeStack} from '~/configs/navigator';
import {ViewSpacing} from '~/theme/components';
import ListView from '~/theme/components/List/ListView';
import {spacing} from '~/theme/configs';
import {data} from './dummy-data';
import * as actions from '~/store/comment/actions';

// TODO: need to use redux to get data
// Temp: using dummy-data to render newsfeed
export type ReactionAction =
  | 'reaction-like'
  | 'reaction-comment'
  | 'reaction-share';

const Home = ({navigation}: {navigation: any}) => {
  const dispatch = useDispatch();

  const _onItemPress = () => {
    dispatch(actions.getComments());
    navigation.navigate(homeStack.postDetail);
  };

  const _onActionPress = (action: ReactionAction) => {
    switch (action) {
      case 'reaction-comment':
        navigation.navigate(homeStack.postDetail, {commentFocus: true});
    }
  };

  return (
    <ListView
      type="content"
      data={data}
      onItemPress={_onItemPress}
      onActionPress={_onActionPress}
      renderItemSeparator={() => <ViewSpacing height={spacing.margin.base} />}
    />
  );
};

export default Home;
