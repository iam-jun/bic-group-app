import React, {useState, useEffect} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import {useBaseHook} from '~/hooks';

import Image from '~/beinComponents/Image';
import Button from '~/beinComponents/Button';
import Text, {TextProps} from '~/beinComponents/Text';
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
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
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
        <View key={`${index}_${item.title}`} style={styles.itemContainer}>
          <PrimaryItem
            title={item.title}
            titleProps={{variant: 'subtitle'}}
            leftIcon={item.leftIcon}
            leftIconProps={{style: styles.iconStyle, ...item.leftIconProps}}
          />
        </View>
      ))}
      <View style={styles.btnContainer}>
        <Button.Secondary
          color={colors.primary1}
          textColor={colors.primary6}
          onPress={onClose}
          // style={styles.btn}
        >
          {t('settings:text_add_work')}
        </Button.Secondary>
        <Button.Primary onPress={goToSetting}>
          {t('settings:text_add_work')}
        </Button.Primary>
      </View>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderRadius: spacing.borderRadius.small,
      marginHorizontal: spacing.margin.extraLarge,
    },
    textContainer: {
      paddingHorizontal: spacing.padding.extraLarge,
      paddingTop: spacing.padding.extraLarge,
      paddingBottom: spacing.padding.large,
    },
    description: {
      marginTop: spacing.margin.tiny,
    },
    btnContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: spacing.padding.large,
    },
    iconStyle: {
      marginRight: spacing.margin.small,
    },
    itemContainer: {
      paddingHorizontal: spacing.padding.extraLarge,
    },
  });
};

export default PermissionsPopupContent;
