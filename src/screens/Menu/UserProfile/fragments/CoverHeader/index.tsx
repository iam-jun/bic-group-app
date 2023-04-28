import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { ResourceUploadType } from '~/interfaces/IUpload';
import { scaleCoverHeight } from '~/theme/dimension';
import AvatarImage from '../../components/AvatarImage';
import CoverImage from '../../components/CoverImage';
import ImagePicker from '~/beinComponents/ImagePicker';
import useUploaderStore from '~/store/uploader';
import { IFilePicked } from '~/interfaces/common';
import useMenuController from '~/screens/Menu/store';
import showToast from '~/store/helper/showToast';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import useBaseHook from '~/hooks/baseHook';
import { AppConfig } from '~/configs';
import { formatBytes } from '~/utils/formatter';

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
  const { t } = useBaseHook();

  const [selectedAvatar, setSelectedAvatar] = useState<IFilePicked>();
  const [selectedCover, setSelectedCover] = useState<IFilePicked>();

  const actions = useMenuController((state) => state.actions);
  const uploaderActions = useUploaderStore((state) => state.actions);
  const uploadAvatarError = useUploaderStore(useCallback(
    (state) => state.errors[selectedAvatar?.name], [selectedAvatar],
  ));
  const uploadedAvatar = useUploaderStore(useCallback(
    (state) => state.uploadedFiles[selectedAvatar?.name], [selectedAvatar],
  ));
  const uploadCoverError = useUploaderStore(useCallback(
    (state) => state.errors[selectedCover?.name], [selectedCover],
  ));
  const uploadedCover = useUploaderStore(useCallback(
    (state) => state.uploadedFiles[selectedCover?.name], [selectedCover],
  ));

  const [coverHeight, setCoverHeight] = useState<number>(210);

  useEffect(() => {
    if (uploadedAvatar) {
      uploadCallback('avatar');
      actions.editMyProfile({
        data: { id, avatarId: uploadedAvatar?.id },
      });
      setSelectedAvatar(null);
    }
  }, [uploadedAvatar]);

  useEffect(() => {
    if (uploadAvatarError) {
      const content = typeof uploadAvatarError === 'string' ? uploadAvatarError : t('post:error_upload_photo_failed');
      showToast({ content, type: ToastType.ERROR });
    }
  }, [uploadAvatarError]);

  useEffect(() => {
    if (uploadedCover) {
      setSelectedCover(null);
      actions.editMyProfile({
        data: { id, backgroundImgId: uploadedCover?.id },
      });
      uploadCallback('backgroundImgUrl');
    }
  }, [uploadedCover]);

  useEffect(() => {
    if (uploadCoverError) {
      const content = typeof uploadCoverError === 'string' ? uploadCoverError : t('post:error_upload_photo_failed');
      showToast({ content, type: ToastType.ERROR });
    }
  }, [uploadCoverError]);

  const onEditCover = async () => {
    const image = await ImagePicker.openPickerSingle({
      cropping: true,
      mediaType: 'photo',
    });
    if (image?.size > AppConfig.userCoverImageMaxSize) {
      const error = t('common:error:file:over_file_size').replace('{n}',
        formatBytes(AppConfig.userAvatarImageMaxSize, 0));
      showToast({ content: error, type: ToastType.ERROR });
      return;
    }
    setSelectedCover(image);
    uploaderActions.uploadImage({ file: image, uploadType: ResourceUploadType.userCover });
  };

  const onEditAvatar = async () => {
    const image = await ImagePicker.openPickerSingle({
      cropping: true,
      mediaType: 'photo',
    });
    if (image?.size > AppConfig.userAvatarImageMaxSize) {
      const error = t('common:error:file:over_file_size').replace('{n}',
        formatBytes(AppConfig.userAvatarImageMaxSize, 0));
      showToast({ content: error, type: ToastType.ERROR });
      return;
    }
    setSelectedAvatar(image);
    uploaderActions.uploadImage({ file: image, uploadType: ResourceUploadType.userAvatar });
  };

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
