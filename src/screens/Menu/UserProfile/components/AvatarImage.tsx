import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';

import React from 'react';
import Avatar from '~/beinComponents/Avatar';
import images from '~/resources/images';
import { spacing } from '~/theme';
import EditButton from './EditButton';

interface Props {
    id: string;
    userId: string;
    currentUsername: string;
    avatar: any;
    onEdit: () => void;
}

const AvatarImage = ({
  id, avatar, userId, currentUsername, onEdit,
}: Props) => {
  const theme:ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  return (
    <View style={styles.imageButton}>
      <View>
        <Avatar.UltraSuperLarge
          source={avatar || images.img_user_avatar_default}
          isRounded
          showBorder
        />
        <EditButton
          testID="user_profile.edit.avatar"
          style={styles.editAvatar}
          userId={userId}
          currentUsername={currentUsername}
          onPress={onEdit}
        />
      </View>
    </View>
  )
}

const themeStyles = (
  theme: ExtendedTheme,
) => {
  const { colors } = theme;

  return StyleSheet.create({
    editAvatar: {
      position: 'absolute',
      bottom: 0,
      right: spacing?.margin.small,
    },
    imageButton: {
      alignItems: 'center',
      marginTop: -44,
    },
  });
}

export default AvatarImage;
