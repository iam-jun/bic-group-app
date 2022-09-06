import { RefreshControl, StyleSheet, View } from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';

import { useTheme, ExtendedTheme } from '@react-navigation/native';
import InfoHeader from '../../../groups/components/InfoHeader';
import AboutContent from './AboutContent';
import CommunityJoinCancelButton from './CommunityJoinCancelButton';
import { useKeySelector } from '~/hooks/selector';
import groupsKeySelector from '../../../../storeRedux/groups/keySelector';
import groupJoinStatus from '~/constants/groupJoinStatus';
import { spacing } from '~/theme';

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

  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Animated.ScrollView
      testID="private_welcome"
      style={styles.container}
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
        <CommunityJoinCancelButton style={styles.btnJoin} />
      </View>

      <AboutContent showPrivate />
    </Animated.ScrollView>
  );
};

export default PrivateWelcome;

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.neutral,
    },
    btnJoin: {
      paddingTop: spacing.padding.base,
      paddingBottom: spacing.padding.large,
    },
  });
};
