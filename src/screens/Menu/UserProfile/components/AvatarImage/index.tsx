import { StyleSheet, View } from 'react-native';

import React from 'react';
import Avatar from '~/baseComponents/Avatar';
import EditButton from '../EditButton';

interface Props {
  isCurrentUser: boolean;
  avatar: any;
  onEdit: () => void;
}

const AvatarImage = ({
  avatar, isCurrentUser, onEdit,
}: Props) => {
  const styles = themeStyles();

  return (
    <View testID="user_profile.avatar_image" style={styles.container}>
      <View>
        <Avatar.XLarge
          source={avatar}
          isRounded
          showBorder
        />
        <EditButton
          testID="user_profile.avatar_image.edit_button"
          style={styles.editAvatar}
          isCurrentUser={isCurrentUser}
          onPress={onEdit}
          icon="CameraSolid"
        />
      </View>
    </View>
  );
};

const themeStyles = (
) => StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: -44,
  },
  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export default AvatarImage;
