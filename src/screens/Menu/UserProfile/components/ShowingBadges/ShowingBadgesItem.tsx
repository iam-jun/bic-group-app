import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/baseComponents/Text';
import { borderRadius } from '~/theme/spacing';
import Avatar from '~/baseComponents/Avatar';
import Button from '~/baseComponents/Button';
import Icon from '~/baseComponents/Icon';
import useUserBadge from '../../fragments/BadgeCollection/store';
import { BADGE_WIDTH } from './helper';

 interface ShowingBadgesItemProps {
  index: number;
  isShowEditButton?: boolean;
}

const ShowingBadgesItem = ({ index, isShowEditButton }: ShowingBadgesItemProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(theme);

  const actions = useUserBadge((state) => state.actions);
  const choosingBadges = useUserBadge((state) => state.choosingBadges);

  const removeBadge = () => {
    actions.removeChoosingBadges(index);
  };

  if (choosingBadges[index]?.id) {
    const { iconUrl, id } = choosingBadges[index];
    return (
      <View key={`showing_badges_${index}_${id || ''}`} style={styles.item}>
        <Avatar.Medium
          isRounded
          source={{ uri: iconUrl }}
        />
        {Boolean(isShowEditButton) && (
          <Button
            style={styles.iconClose}
            onPress={removeBadge}
          >
            <Icon size={10} icon="iconCloseSmall" />
          </Button>
        )}
      </View>
    );
  }
  return (
    <View key={`index_${index}`} style={[styles.item, styles.emptyItem]}>
      <Text.BodyXS color={colors.neutral30}>
        Empty
      </Text.BodyXS>
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    item: {
      height: BADGE_WIDTH,
      width: BADGE_WIDTH,
      borderRadius: borderRadius.pill,
      alignItems: 'center',
    },
    emptyItem: {
      borderColor: colors.neutral5,
      borderWidth: 1,
      justifyContent: 'center',
      backgroundColor: colors.white,
    },
    iconClose: {
      position: 'absolute',
      zIndex: 1,
      backgroundColor: colors.neutral2,
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.pill,
      right: 0,
    },
  });
};

export default ShowingBadgesItem;
