import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import React from 'react';
import Avatar from '~/baseComponents/Avatar';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { IUserBadge } from '~/interfaces/IEditUser';

interface Props {
  style?: StyleProp<ViewStyle>;
  showingBadges?: IUserBadge[];
}

const UserBadge = ({ showingBadges = [], style }: Props) => {
  if (showingBadges.length === 0) return null;
  return (
    <View style={[styles.container, style]} testID="badges.view">
      {showingBadges.map((item, index) => {
        if (!item?.id) return null;
        return (
          <>
            <Avatar.Small
              key={`badge_${item.id}`}
              isRounded
              source={{ uri: item.iconUrl }}
            />
            {index < showingBadges.length - 1 ? <ViewSpacing width={8} /> : null}
          </>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default UserBadge;
