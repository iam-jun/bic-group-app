import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Tooltip from 'react-native-walkthrough-tooltip';
import { Avatar } from '~/baseComponents';
import Icon from '~/baseComponents/Icon';
// import Tooltip from '~/baseComponents/Tooltip/index';
import spacing, { borderRadius } from '~/theme/spacing';
import { IUserBadge } from '~/interfaces/IEditUser';
import Text from '~/baseComponents/Text';
import useUserBadge from './store';

interface Props {
    item: IUserBadge;
    disabled?: boolean;
    onPress: (item: IUserBadge) => void;
}

const GridItem = ({
  item, disabled = false, onPress,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(theme);
  const choosingBadges = useUserBadge((state) => state.choosingBadges);

  const [isVisible, setIsVisible] = useState(false);
  const isSelected = checkIsSelected(choosingBadges, item);

  const onPressItem = () => {
    onPress(item);
  };

  return (
    <Tooltip
      isVisible={isVisible}
      content={<Text.BodyS color={colors.white}>{item?.name || ''}</Text.BodyS>}
      placement="top"
      backgroundColor="transparent"
      disableShadow
      onClose={() => { setIsVisible(false); }}
    >
      <TouchableOpacity
        style={[styles.container,
          isSelected ? styles.selected : styles.default,
        ]}
        disabled={disabled}
        onPress={onPressItem}
        onLongPress={() => { setIsVisible(true); }}
      >
        <Avatar.Medium
          isRounded
          source={{ uri: item?.iconUrl }}
        />
        {isSelected
          ? (
            <View style={styles.iconChose}>
              <Icon size={10} icon="Check" tintColor={colors.white} />
            </View>
          )
          : null}
        {!isSelected && disabled ? <View style={styles.disabled} /> : null}
      </TouchableOpacity>
    </Tooltip>
  );
};

const checkIsSelected = (choosingBadges: IUserBadge[], item: IUserBadge) => {
  const index = choosingBadges.findIndex((badge) => badge?.id === item?.id);
  return index !== -1;
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      margin: spacing.margin.xSmall,
      borderRadius: borderRadius.pill,
    },
    iconChose: {
      backgroundColor: colors.purple50,
      borderRadius: borderRadius.pill,
      height: 20,
      width: 20,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      zIndex: 1,
      right: 0,
    },
    default: {
      borderWidth: 1,
      borderColor: colors.neutral5,
    },
    disabled: {
      backgroundColor: colors.white,
      width: '100%',
      height: '100%',
      position: 'absolute',
      zIndex: 1,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: borderRadius.pill,
      opacity: 0.5,
      overflow: 'hidden',
    },
    selected: {
      borderWidth: 2,
      borderColor: colors.purple50,
    },
  });
};

export default GridItem;
