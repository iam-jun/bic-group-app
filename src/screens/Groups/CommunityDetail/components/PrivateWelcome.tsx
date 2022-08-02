import { RefreshControl, View } from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';

import InfoHeader from '../../components/InfoHeader';
import AboutContent from './AboutContent';
import JoinCancelButton from './JoinCancelButton';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import groupJoinStatus from '~/constants/groupJoinStatus';

interface PrivateWelcomeProps {
  onScroll: (e: any) => void;
  onButtonLayout: (e: any) => void;
  onRefresh?: () => void;
}

const PrivateWelcome = ({
  onScroll,
  onButtonLayout,
  onRefresh,
}: PrivateWelcomeProps) => {
  const isGettingInfoDetail = useKeySelector(groupsKeySelector.isGettingInfoDetail);
  const infoDetail = useKeySelector(groupsKeySelector.communityDetail);
  const { joinStatus } = infoDetail;
  const isMember = joinStatus === groupJoinStatus.member;

  return (
    <Animated.ScrollView
      testID="private_welcome"
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={onScroll}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isGettingInfoDetail}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
    >
      <View onLayout={onButtonLayout}>
        <InfoHeader infoDetail={infoDetail} isMember={isMember} />
        <JoinCancelButton />
      </View>

      <AboutContent />
    </Animated.ScrollView>
  );
};

export default PrivateWelcome;
