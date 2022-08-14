import React from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { openSettings } from 'react-native-permissions';
import { useBaseHook } from '~/hooks';

import Button from '~/beinComponents/Button';
import Text, { TextProps } from '~/beinComponents/Text';
import PrimaryItem, {
  PrimaryItemProps,
} from '~/beinComponents/list/items/PrimaryItem';
import ViewSpacing from './ViewSpacing';
import modalActions from '~/storeRedux/modal/actions';
import spacing from '~/theme/spacing';

export interface PermissionsPopupContentProps {
  style?: StyleProp<ViewStyle>;
  title: string;
  titleProps?: TextProps;
  description?: string;
  descriptionProps?: TextProps;
  steps: Array<any>;
  onClose?: () => void;
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
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const dispatch = useDispatch();

  const onClickRightButton = () => {
    openSettings();
    goToSetting && goToSetting();
  };

  const _onClose = () => {
    dispatch(modalActions.hideModal());
    onClose && onClose();
  };

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
      {(steps || []).map((
        item: PrimaryItemProps, index: number,
      ) => (
        <View key={`${index}_${item.title}`} style={styles.itemContainer}>
          <PrimaryItem
            title={item.title}
            titleProps={{ variant: 'bodyS' }}
            leftIcon={item.leftIcon}
            leftIconProps={{ style: styles.iconStyle, ...item.leftIconProps }}
            height={28}
            style={{ paddingLeft: 0 }}
          />
        </View>
      ))}
      <View style={styles.btnContainer}>
        <Button.Primary onPress={onClickRightButton}>
          {t('common:text_go_to_settings')}
        </Button.Primary>
        <ViewSpacing height={spacing.margin.small} />
        <Button.Secondary
          color={colors.violet1}
          textColor={colors.purple50}
          onPress={_onClose}
        >
          {t('common:text_not_now')}
        </Button.Secondary>
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
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
