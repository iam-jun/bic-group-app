import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { IGroup } from '~/interfaces/IGroup';
import spacing from '~/theme/spacing';
import GroupAboutContent from '../../components/GroupAboutContent';
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
}: GroupPrivateWelcomeProps) => (
  <Animated.ScrollView
    style={styles.content}
    showsVerticalScrollIndicator={false}
    testID="group_private_welcome"
    scrollEventThrottle={16}
    onScroll={onScroll}
  >
    <View onLayout={onGetInfoLayout}>
      <InfoHeader infoDetail={infoDetail} isMember={isMember} />
      <GroupJoinCancelButton />
    </View>

    <GroupAboutContent />
  </Animated.ScrollView>
);

const styles = StyleSheet.create({
  content: {
    width: '100%',
    alignSelf: 'center',
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

export default GroupPrivateWelcome;
