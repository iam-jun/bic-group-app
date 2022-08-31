import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';

import React from 'react';
import Avatar from '~/baseComponents/Avatar';
import images from '~/resources/images';
import { spacing } from '~/theme';
import EditButton from '../EditButton';

interface Props {
  userId: string;
  currentUsername: string;
  avatar: any;
  onEdit: () => void;
}

const AvatarImage = ({
  avatar, userId, currentUsername, onEdit,
}: Props) => {
  const theme:ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  return (
    <View testID="user_profile.avatar_image" style={styles.container}>
      <View>
        <Avatar.XLarge
          source={avatar || images.img_user_avatar_default}
          isRounded
          showBorder
        />
        <EditButton
          testID="user_profile.avatar_image.edit_button"
          style={styles.editAvatar}
          userId={userId}
          currentUsername={currentUsername}
          onPress={onEdit}
        />
      </View>
    </View>
  );
};

const themeStyles = (
  theme: ExtendedTheme,
) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      alignItems: 'center',
      marginTop: -44,
    },
    editAvatar: {
      position: 'absolute',
      bottom: 0,
      right: spacing?.margin.small,
    },
  });
};

export default AvatarImage;
