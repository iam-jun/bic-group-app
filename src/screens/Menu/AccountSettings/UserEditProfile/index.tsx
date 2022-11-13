import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import Header from '~/beinComponents/Header';
import ImagePicker from '~/beinComponents/ImagePicker';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';

import { IUploadType, uploadTypes } from '~/configs/resourceConfig';
import { IFilePicked } from '~/interfaces/common';
import mainStack from '~/router/navigator/MainStack/stack';
import useHomeStore from '~/screens/Home/store';
import {
  userProfileImageCropRatio,
} from '~/theme/dimension';
import { useRootNavigation } from '~/hooks/navigation';

import { useKeySelector } from '~/hooks/selector';
import { checkPermission, permissionTypes } from '~/utils/permission';
import { useBaseHook } from '~/hooks';
import menuActions from '~/storeRedux/menu/actions';
import menuKeySelector from '~/storeRedux/menu/keySelector';
import AvatarImage from './components/AvatarImage';
import CoverImage from './components/CoverImage';
import Description from './components/Description';
import BasicInfo from './components/BasicInfo';
import Contact from './components/Contact';
import WorkExperience from './components/WorkExperience';
import useCommonController from '~/screens/store';
import useAccountSettingsStore from '../store';

const UserEditProfile = () => {
  const styles = createStyles();
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const isFocused = useIsFocused();

  const homeActions = useHomeStore((state) => state.actions);
  const accountSettingsActions = useAccountSettingsStore((state) => state.actions);

  const myProfile = useCommonController((state) => state.myProfile);
  const {
    id,
    fullname,
    gender,
    avatar,
    backgroundImgUrl,
    birthday,
    language,
    relationshipStatus,
    email,
    phone,
    countryCode,
    country,
    city,
    description,
  } = myProfile || {};

  const loadingAvatar = useKeySelector(menuKeySelector.loadingAvatar);
  const loadingCover = useKeySelector(menuKeySelector.loadingCover);

  useEffect(
    () => {
      homeActions.refreshHome();
    }, [myProfile],
  );

  useEffect(() => {
    isFocused && accountSettingsActions.getMyWorkExperience();
  }, [isFocused]);

  const goToEditInfo = () => rootNavigation.navigate(mainStack.editBasicInfo);

  const goToEditContact = () => rootNavigation.navigate(mainStack.editContact);

  const uploadFile = (
    file: IFilePicked,
    fieldName: 'avatar' | 'backgroundImgUrl',
    uploadType: IUploadType,
  ) => {
    dispatch(menuActions.uploadImage({
      id,
      file,
      fieldName,
      uploadType,
    }));
  };

  // fieldName: field name in group profile to be edited
  // 'avatar' for avatar and 'backgroundImgUrl' for cover
  const _openImagePicker = async (
    fieldName: 'avatar' | 'backgroundImgUrl',
    uploadType: IUploadType,
  ) => {
    checkPermission(
      permissionTypes.photo, dispatch, (canOpenPicker) => {
        if (canOpenPicker) {
          ImagePicker.openPickerSingle({
            ...userProfileImageCropRatio[fieldName],
            cropping: true,
            mediaType: 'photo',
          }).then((file) => {
            uploadFile(
              file, fieldName, uploadType,
            );
          });
        }
      },
    );
  };

  const onEditAvatar = () => _openImagePicker('avatar', uploadTypes.userAvatar);

  const onEditCover = () => _openImagePicker('backgroundImgUrl', uploadTypes.userCover);

  const goToEditDescription = () => {
    rootNavigation.navigate(mainStack.userEditDescription);
  };

  return (
    <ScreenWrapper testID="UserEditProfile" style={styles.container} isFullView>
      <Header title={t('settings:title_about')} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <AvatarImage url={avatar} loading={loadingAvatar} onPressEdit={onEditAvatar} />
        <CoverImage url={backgroundImgUrl} loading={loadingCover} onPressEdit={onEditCover} />
        <Description content={description} onPressEdit={goToEditDescription} />
        <BasicInfo
          fullname={fullname}
          gender={gender}
          birthday={birthday}
          language={language}
          relationshipStatus={relationshipStatus}
          onPressEdit={goToEditInfo}
        />
        <Contact
          email={email}
          countryCode={countryCode}
          phone={phone}
          city={city}
          country={country}
          onPressEdit={goToEditContact}
        />
        <WorkExperience />
      </ScrollView>
    </ScreenWrapper>
  );
};

const createStyles = () => StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default UserEditProfile;
