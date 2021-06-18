import React from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';

import {ThemeView} from '~/theme/components';
import Divider from '~/theme/components/Divider';
import ListView from '~/theme/components/List/ListView';
import ScrollView from '~/theme/components/Layout/ScrollView';
import {margin} from '~/theme/configs/spacing';
import {pinnedGroups, groups} from './dummy-data';

const SubscribedGroupScreen = () => {
  const dispatch = useDispatch();

  return (
    <ThemeView testID="GroupScreen" isFullView colorSecondary>
      <ScrollView
        list={{type: 'group', data: groups}}
        renderHeader={() => (
          <View>
            <ListView title="Pinned" type="group" data={pinnedGroups} />
            <Divider thick={2} space={margin.large} />
          </View>
        )}></ScrollView>
    </ThemeView>
  );
};

export default SubscribedGroupScreen;
