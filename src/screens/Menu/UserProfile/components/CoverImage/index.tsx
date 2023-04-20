import React from 'react';
import { StyleSheet, View } from 'react-native';
import Image from '~/components/Image';
import images from '~/resources/images';
import { dimension, spacing } from '~/theme';
import EditButton from '../EditButton';

interface Props {
  isCurrentUser: boolean;
  bgImg: any;
  coverHeight: number;
  onEdit: () => void;
}

const CoverImage = ({
  bgImg, isCurrentUser, coverHeight, onEdit,
}: Props) => (
  <View testID="user_profile.cover_image">
    <Image
      width={dimension.deviceWidth}
      style={[styles.cover, { height: (coverHeight * 2) / 3 }]}
      source={bgImg || images.img_cover_default}
    />
    <EditButton
      testID="user_profile.cover_image.edit_button"
      style={styles.editCoverPhoto}
      isCurrentUser={isCurrentUser}
      onPress={onEdit}
      icon="CameraSolid"
    />
  </View>
);

const styles = StyleSheet.create({
  cover: {
    width: '100%',
  },
  editCoverPhoto: {
    position: 'absolute',
    top: spacing.margin.large,
    right: spacing.margin.large,
  },
});

export default CoverImage;
