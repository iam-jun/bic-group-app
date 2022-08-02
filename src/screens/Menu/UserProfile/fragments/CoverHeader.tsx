import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { uploadTypes } from '~/configs/resourceConfig';
import AvatarImage from '../components/AvatarImage';
import CoverImage from '../components/CoverImage';
import { _openImagePicker } from '../utils';

interface Props {
    id: string;
    userId: string;
    currentUsername: string;
    bgImg: any;
    avatar: any;
}

const CoverHeader = ({
  id, bgImg, userId, currentUsername, avatar,
}: Props) => {
  const dispatch = useDispatch();

  const onEditCover = () => _openImagePicker(
    id,
    'backgroundImgUrl',
    uploadTypes.userCover,
    dispatch,
  );

  const onEditAvatar = () => _openImagePicker(
    id,
    'avatar',
    uploadTypes.userAvatar,
    dispatch,
  );

  return (
    <View
      testID="user_profile.cover_header"
    >
      <CoverImage
        id={id}
        bgImg={bgImg}
        userId={userId}
        currentUsername={currentUsername}
        onEdit={onEditCover}
      />
      <AvatarImage
        id={id}
        avatar={avatar}
        userId={userId}
        currentUsername={currentUsername}
        onEdit={onEditAvatar}
      />
    </View>
  )
}

export default CoverHeader
