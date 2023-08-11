import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { t } from 'i18next';
import Image from '~/components/Image';
import Text from '~/baseComponents/Text';
import images from '~/resources/images';
import { dimension, spacing } from '~/theme';
import { onPressButtonInvite } from '~/components/InvitePeopleToYourGroup/helper';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { ITypeGroup } from '~/interfaces/common';

export interface NoOneIsInvitedProps {
  groupId: string;
  type: ITypeGroup;
}

const NoOneIsInvited = ({ groupId, type }: NoOneIsInvitedProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  const onPress = () => {
    onPressButtonInvite({ groupId, type });
  };

  return (
    <View style={styles.container} testID="no_one_is_invited">
      <Image resizeMode="contain" style={styles.imgEmpty} source={images.img_empty_box} />
      <Text.H3 style={[styles.text, styles.title]} color={theme.colors.neutral60}>
        {t('common:text_no_one_is_invited')}
      </Text.H3>
      <Text.BodyS style={[styles.text, styles.content]} color={colors.neutral40}>
        <Text.BodyS onPress={onPress} color={colors.blue50}>
          {t('common:text_invite_someone')}
        </Text.BodyS>
        {' '}
        {t('common:text_to_see_them_here')}
      </Text.BodyS>
      <ViewSpacing height={dimension.deviceHeight} />
    </View>
  );
};

export default NoOneIsInvited;

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      alignItems: 'center',
    },
    imgEmpty: {
      width: 100,
      height: 85,
      marginTop: spacing.margin.big,
    },
    text: {
      textAlign: 'center',
    },
    title: {
      marginTop: spacing.margin.large,
    },
    content: {
      marginTop: spacing.margin.tiny,
    },
  });
};
