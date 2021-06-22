import React from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';

import {ThemeView} from '~/theme/components';
import Divider from '~/theme/components/Divider';
import ListView from '~/theme/components/List/ListView';
import {margin} from '~/theme/configs/spacing';
import {pinnedGroups, groups} from './dummy-data';

const SubscriptionGroupScreen = () => {
  const dispatch = useDispatch();

  return (
    <ThemeView testID="SubscriptionScreen" isFullView colorSecondary>
      <ListView
        type="group"
        data={groups}
        ListHeaderComponent={
          <View>
            <ListView title="Pinned" type="group" data={pinnedGroups} />
            <Divider thick={2} space={margin.large} />
          </View>
        }
      />
    </ThemeView>
  );
};

export default SubscriptionGroupScreen;
