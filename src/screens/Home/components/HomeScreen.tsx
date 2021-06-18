import React from 'react';
import ListView from '~/theme/components/List/ListView';
import {data} from './dummy-data';

// TODO: need to use redux to get data
// Temp: using dummy-data to render newsfeed
const HomeScreen = ({navigation}) => {
  const _onItemPress = () => {
    navigation.navigate('PostDetail');
  };

  return <ListView type="content" data={data} onItemPress={_onItemPress} />;
};

export default HomeScreen;
