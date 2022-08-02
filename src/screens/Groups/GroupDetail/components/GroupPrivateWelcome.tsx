import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import LockImg from '~/../assets/images/group_private.svg';
import SVGIcon from '~/beinComponents/Icon/SvgIcon';
import Text from '~/beinComponents/Text';
import { IGroup } from '~/interfaces/IGroup';
import spacing from '~/theme/spacing';
import GroupAboutContent from '../../components/GroupAboutContent';
import InfoHeader from '../../components/InfoHeader';

interface GroupPrivateWelcomeProps {
  infoDetail: IGroup;
  isMember: boolean;
}

const GroupPrivateWelcome = ({ infoDetail, isMember }: GroupPrivateWelcomeProps) => (
  <Animated.ScrollView style={styles.content} showsVerticalScrollIndicator={false} testID="group_private_welcome">
    <InfoHeader infoDetail={infoDetail} isMember={isMember} />
    <View style={styles.marginTop}>
      <GroupAboutContent />
    </View>
    <View
      style={styles.svgSection}
      testID="group_private_welcome.bottom_image"
    >
      {/* @ts-ignore */}
      <SVGIcon source={LockImg} size={160} tintColor="none" />
      <Text.H6 useI18n>groups:private_group_welcome_message:title</Text.H6>
      <Text.BodyS useI18n>
        groups:private_group_welcome_message:subtitle
      </Text.BodyS>
    </View>
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
