import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView, ActivityIndicator} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import i18next from 'i18next';
import {useIsFocused} from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import Image from '~/beinComponents/Image';
import Button from '~/beinComponents/Button';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import Avatar from '~/beinComponents/Avatar';

import {ITheme} from '~/theme/interfaces';
import {scaleCoverHeight, userProfileImageCropRatio} from '~/theme/dimension';
import images from '~/resources/images';
import {useRootNavigation} from '~/hooks/navigation';
import ProfileBlock from './components/ProfileBlock';
import menuActions from '../redux/actions';
import {useKeySelector} from '~/hooks/selector';
import menuKeySelector from '../redux/keySelector';
import {useUserIdAuth} from '~/hooks/auth';
import NoUserFound from '~/screens/Menu/fragments/NoUserFound';
import mainStack from '~/router/navigator/MainStack/stack';
import Icon from '~/beinComponents/Icon';
import {IUploadType, uploadTypes} from '~/configs/resourceConfig';
import ImagePicker from '~/beinComponents/ImagePicker';
import {IFilePicked} from '~/interfaces/common';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import {openLink} from '~/utils/common';
import homeActions from '~/screens/Home/redux/actions';
import {checkPermission} from '~/utils/permission';
import {formatDMLink} from '~/utils/link';

const UserProfile = (props: any) => {
  const {userId, params} = props?.route?.params || {};

  const userProfileData = useKeySelector(menuKeySelector.userProfile);
  const {fullname, description, avatar, background_img_url, username} =
    userProfileData || {};
  const loadingUserProfile = useKeySelector(menuKeySelector.loadingUserProfile);

  const myProfileData = useKeySelector(menuKeySelector.myProfile);
  const {username: currentUsername, id} = myProfileData || {};
  const showUserNotFound = useKeySelector(menuKeySelector.showUserNotFound);

  const [coverHeight, setCoverHeight] = useState<number>(210);
  const [avatarState, setAvatarState] = useState<string>(avatar);
  const [bgImgState, setBgImgState] = useState<string>(background_img_url);
  const [isChangeImg, setIsChangeImg] = useState<string>('');

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme, coverHeight);
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const currentUserId = useUserIdAuth();
  const isFocused = useIsFocused();

  const getUserProfile = () => {
    dispatch(menuActions.clearUserProfile());
    if (!!userId) {
      dispatch(menuActions.getUserProfile({userId, params}));
    }
  };

  useEffect(() => {
    setAvatarState(userProfileData?.avatar);
    setBgImgState(userProfileData?.background_img_url);
  }, [userProfileData]);

  useEffect(() => {
    isFocused && getUserProfile();
    const {avatar: _avatar, background_img_url: _bgIm} = myProfileData;
    if (
      userId?.toString?.() === currentUserId?.toString?.() ||
      userId?.toString?.() === currentUsername?.toString?.()
    ) {
      if (avatarState !== _avatar || _bgIm !== bgImgState) {
        dispatch(menuActions.getMyProfile({userId, params}));
        dispatch(homeActions.getHomePosts({isRefresh: true}));
      }
    }
  }, [isFocused, userId]);

  useEffect(() => {
    if (
      userId?.toString?.() === currentUserId?.toString?.() ||
      userId?.toString?.() === currentUsername?.toString?.()
    ) {
      if (isChangeImg === 'avatar') {
        dispatch(homeActions.getHomePosts({isRefresh: true}));
        setAvatarState(myProfileData?.avatar);
      } else if (isChangeImg === 'background_img_url') {
        setBgImgState(myProfileData?.background_img_url);
      }
    }
  }, [myProfileData]);

  const onEditProfileButton = () =>
    rootNavigation.navigate(mainStack.userEdit, {userId});

  const uploadFile = (
    file: IFilePicked,
    fieldName: 'avatar' | 'background_img_url',
    uploadType: IUploadType,
  ) => {
    dispatch(
      menuActions.uploadImage(
        {
          id,
          file,
          fieldName,
          uploadType,
        },
        () => {
          setIsChangeImg(fieldName);
        },
      ),
    );
  };

  const _openImagePicker = async (
    fieldName: 'avatar' | 'background_img_url',
    uploadType: IUploadType,
  ) => {
    checkPermission('photo', dispatch, canOpenPicker => {
      if (canOpenPicker) {
        ImagePicker.openPickerSingle({
          ...userProfileImageCropRatio[fieldName],
          cropping: true,
          mediaType: 'photo',
        }).then(file => {
          uploadFile(file, fieldName, uploadType);
        });
      }
    });
  };

  const onEditAvatar = () => _openImagePicker('avatar', uploadTypes.userAvatar);

  const onEditCover = () =>
    _openImagePicker('background_img_url', uploadTypes.userCover);

  const onCoverLayout = (e: any) => {
    if (!e?.nativeEvent?.layout?.width) return;
    const coverWidth = e.nativeEvent.layout.width;
    const coverHeight = scaleCoverHeight(coverWidth);
    setCoverHeight(coverHeight);
  };

  const onSeeMore = () => {
    rootNavigation.navigate(mainStack.userEdit, {
      userId,
    });
  };

  const onPressChat = () => {
    const link = formatDMLink(
      userProfileData.team_name,
      userProfileData.username,
    );

    openLink(link);
  };

  const renderEditButton = (style: any, onPress: any, testID: string) => {
    return userId == currentUserId || userId == currentUsername ? (
      <ButtonWrapper
        testID={testID}
        style={[styles.editButton, style]}
        activeOpacity={0.9}
        onPress={onPress}>
        <Icon size={16} tintColor={theme.colors.primary7} icon={'Camera'} />
      </ButtonWrapper>
    ) : null;
  };

  const renderCoverImage = () => {
    return (
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
  };

  const renderAvatar = () => {
    return (
      <View style={styles.imageButton}>
        <View>
          <Avatar.UltraSuperLarge
            source={avatarState || images.img_user_avatar_default}
            isRounded={true}
            showBorder={true}
          />
          {renderEditButton(
            styles.editAvatar,
            onEditAvatar,
            'user_profile.edit.avatar',
          )}
        </View>
      </View>
    );
  };

  const renderUserHeader = () => {
    return (
      <View style={styles.headerName}>
        <Text>
          <Text.H4>{fullname}</Text.H4>
        </Text>
        {!!username && <Text.Subtitle>{`@${username}`}</Text.Subtitle>}
        {!!description && (
          <Text>
            <Text style={styles.subtitleText}>{description}</Text>
          </Text>
        )}
      </View>
    );
  };

  const renderButton = () => {
    return userId == currentUserId || userId == currentUsername ? (
      <Button.Secondary
        testID="user_profile.edit"
        textColor={theme.colors.primary6}
        style={styles.buttonEdit}
        leftIcon={'EditAlt'}
        onPress={onEditProfileButton}
        borderRadius={theme.spacing.borderRadius.small}>
        {i18next.t('profile:title_edit_profile')}
      </Button.Secondary>
    ) : (
      <Button.Secondary
        testID="user_profile.message"
        style={styles.button}
        textColor={theme.colors.bgSecondary}
        color={theme.colors.primary6}
        colorHover={theme.colors.primary5}
        rightIcon={'Message'}
        borderRadius={theme.spacing.borderRadius.small}
        onPress={onPressChat}>
        {i18next.t('profile:title_direct_message')}
      </Button.Secondary>
    );
  };

  const renderLoading = () => {
    return (
      <View testID="user_profile.loading" style={styles.loadingProfile}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  if (showUserNotFound) return <NoUserFound />;

  return (
    <ScreenWrapper testID="UserProfile" style={styles.container} isFullView>
      <Header />

      {loadingUserProfile ? (
        renderLoading()
      ) : (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}>
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

const themeStyles = (theme: ITheme, coverHeight: number) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
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
      backgroundColor: colors.primary1,
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
      borderColor: colors.primary6,
    },
  });
};
