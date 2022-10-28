import React, { useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { uploadTypes } from '~/configs/resourceConfig';
import { scaleCoverHeight } from '~/theme/dimension';
import AvatarImage from '../../components/AvatarImage';
import CoverImage from '../../components/CoverImage';
import { _openImagePicker } from '../../helper';

interface Props {
  id: string;
  isCurrentUser: boolean;
  bgImg: any;
  avatar: any;
  uploadCallback: (fieldName: string) => void;
}

const CoverHeader = ({
  id, bgImg, isCurrentUser, avatar, uploadCallback,
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
        bgImg={bgImg}
        isCurrentUser={isCurrentUser}
        coverHeight={coverHeight}
        onEdit={onEditCover}
      />
      <AvatarImage
        avatar={avatar}
        isCurrentUser={isCurrentUser}
        onEdit={onEditAvatar}
      />
    </View>
  );
};

export default CoverHeader;
