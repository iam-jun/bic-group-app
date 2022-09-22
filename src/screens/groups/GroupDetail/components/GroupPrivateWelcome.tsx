import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useKeySelector } from '~/hooks/selector';

import { IGroup } from '~/interfaces/IGroup';
import AboutContent from '~/screens/communities/CommunityDetail/components/AboutContent';
import groupsKeySelector from '~/storeRedux/groups/keySelector';
import spacing from '~/theme/spacing';
import InfoHeader from '../../components/InfoHeader';
import GroupJoinCancelButton from './GroupJoinCancelButton';

interface GroupPrivateWelcomeProps {
  infoDetail: IGroup;
  isMember: boolean;
  onScroll: (e: any) => void;
  onGetInfoLayout: (e: any) => void;
}

const GroupPrivateWelcome = ({
  infoDetail, isMember, onScroll, onGetInfoLayout,
}: GroupPrivateWelcomeProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { name } = useKeySelector(groupsKeySelector.communityDetail);
  const groupDetail = useKeySelector(groupsKeySelector.groupDetail.group);

  return (
    <Animated.ScrollView
      style={styles.content}
      showsVerticalScrollIndicator={false}
      testID="group_private_welcome"
      scrollEventThrottle={16}
      onScroll={onScroll}
    >
      <View onLayout={onGetInfoLayout}>
        <InfoHeader infoDetail={infoDetail} isMember={isMember} insideCommunityName={name} />
        <View style={styles.space} />
        <GroupJoinCancelButton />
      </View>

      <AboutContent profileInfo={groupDetail} showPrivate />
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
