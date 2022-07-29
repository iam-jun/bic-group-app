import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, ScrollView, ActivityIndicator,
} from 'react-native';
import { ExtendedTheme, useTheme, useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import i18next from 'i18next';

import { isEmpty } from 'lodash';
import Text from '~/beinComponents/Text';
import Image from '~/beinComponents/Image';
import Button from '~/beinComponents/Button';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import Avatar from '~/beinComponents/Avatar';

import { scaleCoverHeight, userProfileImageCropRatio } from '~/theme/dimension';
import images from '~/resources/images';
import { useRootNavigation } from '~/hooks/navigation';
import ProfileBlock from './components/ProfileBlock';
import menuActions from '../redux/actions';
import { useKeySelector } from '~/hooks/selector';
import menuKeySelector from '../redux/keySelector';
import { useUserIdAuth } from '~/hooks/auth';
import NoUserFound from '~/screens/Menu/fragments/NoUserFound';
import mainStack from '~/router/navigator/MainStack/stack';
import Icon from '~/beinComponents/Icon';
import { IUploadType, uploadTypes } from '~/configs/resourceConfig';
import ImagePicker from '~/beinComponents/ImagePicker';
import { IFilePicked } from '~/interfaces/common';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import homeActions from '~/screens/Home/redux/actions';
import { checkPermission, permissionTypes } from '~/utils/permission';
import { formatDMLink, openUrl } from '~/utils/link';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import groupsActions from '~/screens/Groups/redux/actions';
import spacing from '~/theme/spacing';

const UserProfile = (props: any) => {
  const { userId, params } = props?.route?.params || {};

  const userProfileData = useKeySelector(menuKeySelector.userProfile);
  const {
    fullname, description, avatar, backgroundImgUrl, username,
  } = userProfileData || {};
  const loadingUserProfile = useKeySelector(menuKeySelector.loadingUserProfile);

  const myProfileData = useKeySelector(menuKeySelector.myProfile);
  const { username: currentUsername, id } = myProfileData || {};
  const showUserNotFound = useKeySelector(menuKeySelector.showUserNotFound);
  const joinedCommunities = useKeySelector(groupsKeySelector.joinedCommunities);

  const [coverHeight, setCoverHeight] = useState<number>(210);
  const [avatarState, setAvatarState] = useState<string>(avatar);
  const [bgImgState, setBgImgState] = useState<string>(backgroundImgUrl);
  const [isChangeImg, setIsChangeImg] = useState<string>('');

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(
    theme, coverHeight,
  );
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();

  const currentUserId = useUserIdAuth();
  const isFocused = useIsFocused();

  const getUserProfile = () => {
    dispatch(menuActions.clearUserProfile());
    if (userId) {
      dispatch(menuActions.getUserProfile({ userId, params }));
    }
  };

  useEffect(() => {
    setAvatarState(userProfileData?.avatar);
    setBgImgState(userProfileData?.backgroundImgUrl);
  }, [userProfileData]);

  useEffect(() => {
    isFocused && getUserProfile();
    const { avatar: _avatar, backgroundImgUrl: _bgIm } = myProfileData;
    if (
      userId?.toString?.() === currentUserId?.toString?.()
      || userId?.toString?.() === currentUsername?.toString?.()
    ) {
      if (avatarState !== _avatar || _bgIm !== bgImgState) {
        dispatch(menuActions.getMyProfile({ userId, params }));
        dispatch(homeActions.getHomePosts({ isRefresh: true }));
      }
    }
  }, [isFocused, userId]);

  useEffect(
    () => {
      if (
        userId?.toString?.() === currentUserId?.toString?.()
      || userId?.toString?.() === currentUsername?.toString?.()
      ) {
        if (isChangeImg === 'avatar') {
          dispatch(homeActions.getHomePosts({ isRefresh: true }));
          setAvatarState(myProfileData?.avatar);
        } else if (isChangeImg === 'backgroundImgUrl') {
          setBgImgState(myProfileData?.backgroundImgUrl);
        }
      }
    }, [myProfileData],
  );

  const onEditProfileButton = () => rootNavigation.navigate(
    mainStack.userEdit, { userId },
  );

  const uploadFile = (
    file: IFilePicked,
    fieldName: 'avatar' | 'backgroundImgUrl',
    uploadType: IUploadType,
  ) => {
    dispatch(menuActions.uploadImage(
      {
        id,
        file,
        fieldName,
        uploadType,
      },
      () => {
        setIsChangeImg(fieldName);
      },
    ));
  };

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

  const onEditAvatar = () => _openImagePicker(
    'avatar', uploadTypes.userAvatar,
  );

  const onEditCover = () => _openImagePicker('backgroundImgUrl', uploadTypes.userCover);

  const onCoverLayout = (e: any) => {
    if (!e?.nativeEvent?.layout?.width) return;
    const coverWidth = e.nativeEvent.layout.width;
    const coverHeight = scaleCoverHeight(coverWidth);
    setCoverHeight(coverHeight);
  };

  const onSeeMore = () => {
    rootNavigation.navigate(
      mainStack.userEdit, {
        userId,
      },
    );
  };

  const onPressChat = () => {
    if (!isEmpty(joinedCommunities)) {
      const link = formatDMLink(
        joinedCommunities?.[0]?.slug,
        userProfileData.username,
      );
      openUrl(link);
    } else {
      dispatch(groupsActions.getMyCommunities({ callback: onPressChat }));
    }
  };

  const renderEditButton = (
    style: any, onPress: any, testID: string,
  ) => (userId == currentUserId || userId == currentUsername ? (
    <ButtonWrapper
      testID={testID}
      style={[styles.editButton, style]}
      activeOpacity={0.9}
      onPress={onPress}
    >
      <Icon size={16} tintColor={theme.colors.purple60} icon="Camera" />
    </ButtonWrapper>
  ) : null);

  const renderCoverImage = () => (
    <View testID="user_profile.cover_image" onLayout={onCoverLayout}>
      <Image
        style={styles.cover}
        source={bgImgState || images.img_cover_default}
      />
      {renderEditButton(
        styles.editCoverPhoto,
        onEditCover,
        'user_profile.edit.cover_image',
      )}
    </View>
  );

  const renderAvatar = () => (
    <View style={styles.imageButton}>
      <View>
        <Avatar.UltraSuperLarge
          source={avatarState || images.img_user_avatar_default}
          isRounded
          showBorder
        />
        {renderEditButton(
          styles.editAvatar,
          onEditAvatar,
          'user_profile.edit.avatar',
        )}
      </View>
    </View>
  );

  const renderUserHeader = () => (
    <View style={styles.headerName}>
      <Text>
        <Text.H4>{fullname}</Text.H4>
      </Text>
      {!!username && <Text.BodyS>{`@${username}`}</Text.BodyS>}
      {!!description && (
      <Text>
        <Text style={styles.subtitleText}>{description}</Text>
      </Text>
      )}
    </View>
  );

  const renderButton = () => (userId == currentUserId || userId == currentUsername ? (
    <Button.Secondary
      testID="user_profile.edit"
      textColor={theme.colors.purple50}
      style={styles.buttonEdit}
      leftIcon="PenLine"
      onPress={onEditProfileButton}
      borderRadius={spacing.borderRadius.small}
    >
      {i18next.t('profile:title_edit_profile')}
    </Button.Secondary>
  ) : (
    <Button.Secondary
      testID="user_profile.message"
      style={styles.button}
      textColor={theme.colors.neutral1}
      color={theme.colors.purple50}
      colorHover={theme.colors.purple30}
      rightIcon="Message"
      borderRadius={spacing.borderRadius.small}
      onPress={onPressChat}
    >
      {i18next.t('profile:title_direct_message')}
    </Button.Secondary>
  ));

  const renderLoading = () => (
    <View testID="user_profile.loading" style={styles.loadingProfile}>
      <ActivityIndicator size="large" />
    </View>
  );

  if (showUserNotFound) return <NoUserFound />;

  return (
    <ScreenWrapper testID="UserProfile" style={styles.container} isFullView>
      <Header />

      {loadingUserProfile ? (
        renderLoading()
      ) : (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {renderCoverImage()}
          {renderAvatar()}
          {renderUserHeader()}
          {renderButton()}
          <ProfileBlock
            profileData={userProfileData}
            onSeeMore={onSeeMore}
            hideSeeMore={userId == currentUserId || userId == currentUsername}
          />
        </ScrollView>
      )}
    </ScreenWrapper>
  );
};

export default UserProfile;

const themeStyles = (
  theme: ExtendedTheme, coverHeight: number,
) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
    },
    cover: {
      width: '100%',
      height: coverHeight,
    },
    imageButton: {
      alignItems: 'center',
      marginTop: -44,
    },
    headerName: {
      alignItems: 'center',
      paddingVertical: spacing.margin.base,
      paddingHorizontal: spacing.margin.large,
    },
    subtitleText: {
      marginTop: spacing.margin.small,
    },
    button: {
      marginHorizontal: spacing.margin.large,
    },
    loadingProfile: {
      marginTop: spacing.margin.extraLarge,
    },
    editButton: {
      backgroundColor: colors.violet1,
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: spacing?.borderRadius.small,
      marginLeft: spacing?.padding.small,
    },
    editCoverPhoto: {
      position: 'absolute',
      top: spacing?.margin.small,
      right: spacing?.margin.small,
    },
    editAvatar: {
      position: 'absolute',
      bottom: 0,
      right: spacing?.margin.small,
    },
    buttonEdit: {
      marginHorizontal: spacing.margin.large,
      borderWidth: 1,
      borderColor: colors.purple50,
    },
  });
};
