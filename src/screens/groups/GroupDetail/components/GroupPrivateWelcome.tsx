import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { ICommunity } from '~/interfaces/ICommunity';

import { IGroup } from '~/interfaces/IGroup';
import AboutContent from '~/screens/communities/CommunityDetail/components/AboutContent';
import spacing from '~/theme/spacing';
import InfoHeader from '../../components/InfoHeader';
import GroupJoinCancelButton from './GroupJoinCancelButton';
import { onRefresh } from './helper';
import Divider from '~/beinComponents/Divider';
import { ITypeGroup } from '~/interfaces/common';
import InvitationView from '~/screens/communities/CommunityDetail/components/InvitationView';

interface GroupPrivateWelcomeProps {
  groupId: string;
  infoDetail: IGroup;
  community: ICommunity;
  onScroll: (e: any) => void;
  onGetInfoLayout: (e: any) => void;
}

const GroupPrivateWelcome = ({
  groupId, infoDetail, community, onScroll, onGetInfoLayout,
}: GroupPrivateWelcomeProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors, elevations } = theme;
  const styles = themeStyles(theme);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const _onRefresh = async () => {
    await onRefresh({ setIsRefreshing, groupId, isPrivacyGroup: true });
  };

  return (
    <Animated.ScrollView
      style={styles.content}
      showsVerticalScrollIndicator={false}
      testID="group_private_welcome"
      scrollEventThrottle={16}
      onScroll={onScroll}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={_onRefresh} />}
    >
      <View onLayout={onGetInfoLayout} style={elevations.e2}>
        <InfoHeader
          infoDetail={infoDetail}
          insideCommunityName={community?.name}
        />
        <View style={styles.space} />
        <GroupJoinCancelButton groupId={groupId} />
        <InvitationView data={infoDetail?.invitation} communityId="" groupId={groupId} type={ITypeGroup.GROUP} />
      </View>

      <Divider size={spacing.margin.large} color={colors.gray5} />
      <AboutContent profileInfo={infoDetail as any} showPrivate groupId={groupId} />
    </Animated.ScrollView>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    space: {
      height: spacing.padding.base,
      backgroundColor: colors.white,
    },
    content: {
      width: '100%',
      alignSelf: 'center',
      backgroundColor: colors.gray5,
    },
    marginTop: {
      marginTop: spacing.margin.large,
    },
    svgSection: {
      minHeight: 252,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

export default GroupPrivateWelcome;
