import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';
import { spacing } from '~/theme';
import { scaleCoverHeight } from '~/theme/dimension';
import EditButton from './EditButton';

interface Props {
    id: string;
    userId: string;
    currentUsername: string;
    bgImg: any;
    coverHeight: number;
    onEdit: () => void;
}

const CoverImage = ({
  id, bgImg, userId, currentUsername, coverHeight, onEdit,
}: Props) => {
  const theme:ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  return (
    <View testID="user_profile.cover_image">
      <Image
        style={[styles.cover, { height: (coverHeight * 2) / 3 }]}
        source={bgImg || images.img_cover_default}
      />
      <EditButton
        testID="user_profile.edit.cover_image"
        style={styles.editCoverPhoto}
        userId={userId}
        currentUsername={currentUsername}
        onPress={onEdit}
      />
    </View>
  )
}

const themeStyles = (
  theme: ExtendedTheme,
) => {
  const { colors } = theme;

  return StyleSheet.create({
    cover: {
      width: '100%',
    },
    editCoverPhoto: {
      position: 'absolute',
      top: spacing.margin.small,
      right: spacing?.margin.small,
    },
  });
}

export default CoverImage
