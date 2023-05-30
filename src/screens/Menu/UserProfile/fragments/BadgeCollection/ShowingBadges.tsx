import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Text from '~/baseComponents/Text';
import spacing, { borderRadius } from '~/theme/spacing';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Avatar from '~/baseComponents/Avatar';
import Button from '~/baseComponents/Button';
import Icon from '~/baseComponents/Icon';
import useUserBadge from './store';

const BADGE_WIDTH = 48;

const ShowingBadges = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(theme);

  const choosingBadges = useUserBadge((state) => state.choosingBadges);
  const actions = useUserBadge((state) => state.actions);
  const isEditing = useUserBadge((state) => state.isEditing);

  const removeBadge = (index: number) => {
    actions.removeChoosingBadges(index);
  };

  const renderEmptyItem = (index: number) => (
    <View key={`index_${index}`} style={[styles.item, styles.emptyItem]}>
      <Text.BodyXS color={colors.neutral30}>
        Empty
      </Text.BodyXS>
    </View>
  );

  const renderItem = (index: number) => {
    if (choosingBadges[index]?.id) {
      const { iconUrl, id } = choosingBadges[index];
      return (
        <View key={`showing_badges_${index}_${id || ''}`}>
          <Avatar.Medium
            isRounded
            source={{ uri: iconUrl }}
          />
          {isEditing
            ? (
              <Button
                style={styles.iconClose}
                onPress={() => { removeBadge(index); }}
              >
                <Icon size={10} icon="iconCloseSmall" />
              </Button>
            )
            : null}
        </View>
      );
    } return renderEmptyItem(index);
  };

  return (
    <View style={styles.row}>
      {renderItem(0)}
      <ViewSpacing width={spacing.margin.large} />
      {renderItem(1)}
      <ViewSpacing width={spacing.margin.large} />
      {renderItem(2)}
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing.padding.large,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.padding.large,
    },
    item: {
      height: BADGE_WIDTH,
      width: BADGE_WIDTH,
      borderRadius: borderRadius.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyItem: {
      borderColor: colors.neutral5,
      borderWidth: 1,
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

export default ShowingBadges;
