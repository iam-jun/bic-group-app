import { RefreshControl, StyleSheet, View } from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';

import { useTheme, ExtendedTheme } from '@react-navigation/native';
import InfoHeader from '../../../../groups/components/InfoHeader';
import AboutContent from '../AboutContent';
import CommunityJoinCancelButton from '../CommunityJoinCancelButton';
import { spacing } from '~/theme';
import { ICommunity } from '~/interfaces/ICommunity';
import GroupJoinStatus from '~/constants/GroupJoinStatus';

interface PrivateWelcomeProps {
  isFetching: boolean;
  community: ICommunity;
  onScroll: (e: any) => void;
  onButtonLayout: (e: any) => void;
  onRefresh?: () => void;
}

const PrivateWelcome = ({
  isFetching,
  community,
  onScroll,
  onButtonLayout,
  onRefresh,
}: PrivateWelcomeProps) => {
  const { joinStatus } = community;
  const isMember = joinStatus === GroupJoinStatus.MEMBER;

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
            refreshing={!!isFetching}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
    >
      <View onLayout={onButtonLayout}>
        <InfoHeader infoDetail={community} />
        <CommunityJoinCancelButton style={styles.btnJoin} community={community} isMember={isMember} />
      </View>

      <AboutContent profileInfo={community as any} showPrivate groupId={community?.groupId} />
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
