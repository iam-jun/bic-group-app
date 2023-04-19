import React, { useState } from 'react';
import { View } from 'react-native';
import { ResourceUploadType } from '~/interfaces/IUpload';
import { scaleCoverHeight, userProfileImageCropRatio } from '~/theme/dimension';
import AvatarImage from '../../components/AvatarImage';
import CoverImage from '../../components/CoverImage';
import { checkPermission, PermissionTypes } from '~/utils/permission';
import ImagePicker from '~/beinComponents/ImagePicker';
import useMenuController from '~/screens/Menu/store';
import { IUserImageUpload } from '~/interfaces/IEditUser';

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
  const actions = useMenuController((state) => state.actions);

  const [coverHeight, setCoverHeight] = useState<number>(210);

  const openImagePicker = async (
    id: string,
    fieldName: 'avatar' | 'backgroundImgUrl',
    uploadType: ResourceUploadType,
    callback?: (fieldName: string) => void,
  ) => {
    checkPermission(
      PermissionTypes.photo, (canOpenPicker) => {
        if (canOpenPicker) {
          ImagePicker.openPickerSingle({
            ...userProfileImageCropRatio[fieldName],
            cropping: true,
            mediaType: 'photo',
          }).then((file) => {
            const payload:IUserImageUpload = {
              id, file, fieldName, uploadType,
            };
            actions.uploadImage(payload, () => { callback(fieldName); });
          });
        }
      },
    );
  };

  const onEditCover = () => openImagePicker(
    id,
    'backgroundImgUrl',
    ResourceUploadType.userCover,
    uploadCallback,
  );

  const onEditAvatar = () => openImagePicker(
    id,
    'avatar',
    ResourceUploadType.userAvatar,
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
