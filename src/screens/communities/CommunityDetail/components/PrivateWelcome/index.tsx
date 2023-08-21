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
import InvitationView from '../InvitationView';
import { ITypeGroup } from '~/interfaces/common';
import Divider from '~/beinComponents/Divider';

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
  const { joinStatus, invitation, id } = community;
  const isMember = joinStatus === GroupJoinStatus.MEMBER;

  const theme = useTheme();
  const { colors, elevations } = theme;
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
      <View onLayout={onButtonLayout} style={elevations.e2}>
        <InfoHeader infoDetail={community} />
        <InvitationView data={invitation} communityId={id} groupId="" type={ITypeGroup.COMMUNITY} style={styles.invitationView} />
        <CommunityJoinCancelButton style={styles.btnJoin} community={community} isMember={isMember} />
      </View>

      <Divider size={spacing.margin.large} color={colors.gray5} />
      <AboutContent profileInfo={community as any} showPrivate groupId={community?.groupId} />
    </Animated.ScrollView>
  );
};

export default PrivateWelcome;

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.gray5,
    },
    btnJoin: {
      paddingTop: spacing.padding.base,
      paddingBottom: spacing.padding.large,
    },
    invitationView: {
      marginTop: spacing.margin.base,
    },
  });
};
