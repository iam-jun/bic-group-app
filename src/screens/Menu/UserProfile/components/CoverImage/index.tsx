import React from 'react';
import { StyleSheet, View } from 'react-native';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';
import { spacing } from '~/theme';
import EditButton from '../EditButton';

interface Props {
  userId: string;
  currentUsername: string;
  bgImg: any;
  coverHeight: number;
  onEdit: () => void;
}

const CoverImage = ({
  bgImg, userId, currentUsername, coverHeight, onEdit,
}: Props) => (
  <View testID="user_profile.cover_image">
    <Image
      style={[styles.cover, { height: (coverHeight * 2) / 3 }]}
      source={bgImg || images.img_cover_default}
    />
    <EditButton
      testID="user_profile.cover_image.edit_button"
      style={styles.editCoverPhoto}
      userId={userId}
      currentUsername={currentUsername}
      onPress={onEdit}
    />
  </View>
);

const styles = StyleSheet.create({
  cover: {
    width: '100%',
  },
  editCoverPhoto: {
    position: 'absolute',
    top: spacing.margin.small,
    right: spacing?.margin.small,
  },
});

export default CoverImage;
