import React, {useState, useEffect} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Image from '~/beinComponents/Image';
import Button from '~/beinComponents/Button';
import Text, {TextProps} from '~/beinComponents/Text';
import {useBaseHook} from '~/hooks';
import {getResourceUrl, IUploadType} from '~/configs/resourceConfig';
import PrimaryItem, {
  PrimaryItemProps,
} from '~/beinComponents/list/items/PrimaryItem';

export interface PermissionsPopupContentProps {
  style?: StyleProp<ViewStyle>;
  title: string;
  titleProps?: TextProps;
  description?: string;
  descriptionProps?: TextProps;
  steps: Array<any>;
  onClose: () => void;
  goToSetting?: () => void;
}

const PermissionsPopupContent: React.FC<PermissionsPopupContentProps> = ({
  style,
  title,
  titleProps,
  description,
  descriptionProps,
  steps,
  onClose,
  goToSetting,
}: PermissionsPopupContentProps) => {
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.textContainer}>
        <Text.H5 style={{}} {...titleProps}>
          {title}
        </Text.H5>
        <Text.BodyS style={styles.description} {...descriptionProps}>
          {description}
        </Text.BodyS>
      </View>
      {(steps || []).map((item: PrimaryItemProps, index: number) => (
        <View key={`${index}_${item.title}`}>
          <PrimaryItem
            title={item.title}
            titleProps={{variant: 'subtitle'}}
            leftIcon={item.leftIcon}
            leftIconProps={{icon: item.leftIcon, size: 20}}
          />
        </View>
      ))}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderRadius: spacing.borderRadius.small,
    },
    textContainer: {
      paddingHorizontal: spacing.padding.extraLarge,
      paddingTop: spacing.padding.extraLarge,
      paddingBottom: spacing.padding.large,
    },
    description: {
      marginTop: spacing.margin.tiny,
    },
  });
};

export default PermissionsPopupContent;
