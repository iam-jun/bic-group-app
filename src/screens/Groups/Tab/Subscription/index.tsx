import React from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';

import {ScreenWrapper} from '~/components';
import Divider from '~/components/Divider';
import ListView from '~/components/list/ListView';
import {margin} from '~/theme/spacing';
import {pinnedGroups, groups} from './dummy-data';

const SubscriptionGroupScreen = () => {
  const dispatch = useDispatch();

  return (
    <ScreenWrapper testID="SubscriptionScreen" isFullView>
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
    </ScreenWrapper>
  );
};

export default SubscriptionGroupScreen;
