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
import useGroupsStore, { IGroupsState } from '~/store/entities/groups';
import { onRefresh } from './helper';

interface GroupPrivateWelcomeProps {
  infoDetail: IGroup;
  community: ICommunity;
  onScroll: (e: any) => void;
  onGetInfoLayout: (e: any) => void;
}

const GroupPrivateWelcome = ({
  infoDetail, community, onScroll, onGetInfoLayout,
}: GroupPrivateWelcomeProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const { currentGroupId, groups } = useGroupsStore((state: IGroupsState) => state);
  const { group: groupData } = groups[currentGroupId] || {};
  const { id: groupId } = groupData || {};

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
      <View onLayout={onGetInfoLayout}>
        <InfoHeader
          infoDetail={infoDetail}
          insideCommunityName={community?.name}
        />
        <View style={styles.space} />
        <GroupJoinCancelButton />
      </View>

      <AboutContent profileInfo={infoDetail as any} showPrivate groupId={groupId} />
    </Animated.ScrollView>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    space: {
      height: spacing.padding.small,
      backgroundColor: colors.white,
    },
    content: {
      width: '100%',
      alignSelf: 'center',
      backgroundColor: colors.white,
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
