import React from 'react';
import {homeStack} from '~/configs/navigator';
import ListView from '~/theme/components/List/ListView';
import {data} from './dummy-data';

// TODO: need to use redux to get data
// Temp: using dummy-data to render newsfeed
const Home = ({navigation}: {navigation: any}) => {
  const _onItemPress = () => {
    navigation.navigate(homeStack.postDetail);
  };

  return <ListView type="content" data={data} onItemPress={_onItemPress} />;
};

export default Home;
