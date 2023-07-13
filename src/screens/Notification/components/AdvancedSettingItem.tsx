import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import ButtonWrapper from '~/baseComponents/Button/ButtonWrapper';
import { GroupPrivacyDetail } from '~/constants/privacyTypes';
import { IGroup } from '~/interfaces/IGroup';
import { IconType } from '~/resources/icons';
import spacing from '~/theme/spacing';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { Avatar } from '~/baseComponents';
import { useSkeletonAnimation } from '~/hooks/useSkeletonAnimation';
import useAdvancedNotiSettingsStore from '../AdvancedSettings/store';

interface Props {
    item: IGroup;
    onPress: (item: IGroup) => void;
}

const AdvancedSettingItem = ({ item, onPress }: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const animatedStyle = useSkeletonAnimation({ targetOpacityValue: 0.5, speed: 500 });

  const isLoading = useAdvancedNotiSettingsStore((state) => state.isLoadingGroupSettings);

  const onPressItem = () => onPress(item);

  if (isEmpty(item)) return null;
  const { icon, name, privacy } = item;
  const privacyIcon = GroupPrivacyDetail[privacy]?.icon as IconType;
  return (
    <ButtonWrapper
      activeOpacity={0.85}
      style={styles.container}
      onPress={onPressItem}
    >
      <Avatar.Base source={icon} privacyIcon={privacyIcon} />
      <ViewSpacing width={spacing.margin.small} />
      <View>
        <Text.BodyMMedium color={colors.neutral60} numberOfLines={2}>{name}</Text.BodyMMedium>
        {
          Boolean(isLoading)
            ? <Animated.View style={[styles.labelSkeleton, animatedStyle]} />
            : <Text.BadgeM color={colors.neutral40}>default</Text.BadgeM>
        }
      </View>
    </ButtonWrapper>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: colors.white,
    },
    labelSkeleton: {
      width: 80,
      height: 12,
    },
  });
};

export default AdvancedSettingItem;
