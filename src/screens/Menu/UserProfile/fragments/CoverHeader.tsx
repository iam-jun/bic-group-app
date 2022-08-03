import React, { useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { uploadTypes } from '~/configs/resourceConfig';
import { scaleCoverHeight } from '~/theme/dimension';
import AvatarImage from '../components/AvatarImage';
import CoverImage from '../components/CoverImage';
import { _openImagePicker } from '../utils';

interface Props {
    id: string;
    userId: string;
    currentUsername: string;
    bgImg: any;
    avatar: any;
    uploadCallback: (fieldName: string) => void;
}

const CoverHeader = ({
  id, bgImg, userId, currentUsername, avatar, uploadCallback,
}: Props) => {
  const dispatch = useDispatch();
  const [coverHeight, setCoverHeight] = useState<number>(210);

  const onEditCover = () => _openImagePicker(
    id,
    'backgroundImgUrl',
    uploadTypes.userCover,
    dispatch,
    uploadCallback,
  );

  const onEditAvatar = () => _openImagePicker(
    id,
    'avatar',
    uploadTypes.userAvatar,
    dispatch,
    uploadCallback,
  );

  const onCoverLayout = (e: any) => {
    if (!e?.nativeEvent?.layout?.width) return;
    const coverWidth = e.nativeEvent.layout.width;
    const coverHeight = scaleCoverHeight(coverWidth);
    setCoverHeight(coverHeight);
  };

  return (
    <View
      testID="user_profile.cover_header"
      style={{ height: coverHeight }}
      onLayout={onCoverLayout}
    >
      <CoverImage
        id={id}
        bgImg={bgImg}
        userId={userId}
        currentUsername={currentUsername}
        coverHeight={coverHeight}
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
