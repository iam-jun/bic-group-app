import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
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
import {chatSchemes} from '~/constants/chat';
import homeActions from '~/screens/Home/redux/actions';

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

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme, coverHeight);
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const currentUserId = useUserIdAuth();
  const isFocused = useIsFocused();

  const getUserProfile = () => {
    dispatch(menuActions.clearUserProfile());
    if (!!userId) dispatch(menuActions.getUserProfile({userId, params}));
  };

  useEffect(() => {
    isFocused && getUserProfile();
    const {avatar: _avatar, background_img_url: _bgIm} = myProfileData;
    if (
      userId?.toString?.() === currentUserId?.toString?.() ||
      userId?.toString?.() === currentUsername?.toString?.()
    ) {
      if (avatarState !== _avatar) {
        setAvatarState(_avatar);
        dispatch(homeActions.getHomePosts({isRefresh: true}));
      }
      if (_bgIm !== bgImgState) {
        setBgImgState(_bgIm);
      }
    }
  }, [isFocused, userId, myProfileData]);

  const onEditProfileButton = () =>
    rootNavigation.navigate(mainStack.userEdit, {userId, params});

  const uploadFile = (
    file: IFilePicked,
    fieldName: 'avatar' | 'background_img_url',
    uploadType: IUploadType,
  ) => {
    dispatch(
      menuActions.uploadImage({
        id,
        file,
        fieldName,
        uploadType,
      }),
    );
  };

  const _openImagePicker = (
    fieldName: 'avatar' | 'background_img_url',
    uploadType: IUploadType,
  ) => {
    ImagePicker.openPickerSingle({
      ...userProfileImageCropRatio[fieldName],
      cropping: true,
      mediaType: 'photo',
    }).then(file => {
      uploadFile(file, fieldName, uploadType);
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
      params:
        userId == currentUserId || userId == currentUsername
          ? {}
          : {...userProfileData},
    });
  };

  const renderEditButton = (style: any, onPress: any) => {
    return userId == currentUserId || userId == currentUsername ? (
      <ButtonWrapper
        style={[styles.editButton, style]}
        activeOpacity={0.9}
        onPress={onPress}>
        <Icon size={16} tintColor={theme.colors.primary7} icon={'Camera'} />
      </ButtonWrapper>
    ) : null;
  };

  const renderCoverImage = () => {
    return (
      <View onLayout={onCoverLayout}>
        <Image
          style={styles.cover}
          source={bgImgState || images.img_cover_default}
        />
        {renderEditButton(styles.editCoverPhoto, onEditCover)}
      </View>
    );
  };

  const renderAvatar = () => {
    return (
      <View style={styles.imageButton}>
        <View>
          <Avatar.UltraSuperLarge
            style={styles.avatar}
            source={avatarState || images.img_user_avatar_default}
            isRounded={true}
            showBorder={true}
          />
          {renderEditButton(styles.editAvatar, onEditAvatar)}
        </View>
      </View>
    );
  };

  const renderUserHeader = () => {
    return (
      <View style={styles.headerName}>
        <Text.H4>{fullname}</Text.H4>
        {!!username && <Text.Subtitle>{`@${username}`}</Text.Subtitle>}
        {!!description && (
          <Text style={styles.subtitleText}>{description}</Text>
        )}
      </View>
    );
  };

  const renderButton = () => {
    return userId == currentUserId || userId == currentUsername ? (
      <Button.Secondary
        testID="user_profile.edit"
        textColor={theme.colors.primary6}
        style={Platform.OS === 'web' ? styles.buttonEditWeb : styles.buttonEdit}
        leftIcon={'EditAlt'}
        onPress={onEditProfileButton}
        borderRadius={theme.spacing.borderRadius.small}
        contentStyle={
          Platform.OS === 'web' ? styles.buttonEditWebContainer : {}
        }>
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
        onPress={() => {
          openLink(
            `${chatSchemes.DIRECT_MESSAGE}/@${userProfileData.username}`,
          );
        }}>
        {i18next.t('profile:title_direct_message')}
      </Button.Secondary>
    );
  };

  const renderLoading = () => {
    return (
      <View style={styles.loadingProfile}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  if (showUserNotFound) return <NoUserFound />;

  return (
    <ScreenWrapper testID="UserProfile" style={styles.container} isFullView>
      <Header hideBackOnLaptop />

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
    coverHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.small,
    },
    divider: {
      marginVertical: spacing.margin.small,
    },
    cover: {
      width: '100%',
      height: coverHeight,
    },
    imageButton: {
      alignItems: 'center',
      marginTop: -44,
    },
    avatar: {
      // width: scaleSize(100),
      // height: scaleSize(100),
      // maxHeight: 125,
      // maxWidth: 125,
    },
    headerName: {
      alignItems: 'center',
      paddingVertical: spacing.margin.base,
    },
    subtitleText: {
      marginTop: spacing.margin.small,
      marginHorizontal: spacing.margin.large,
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
    buttonEditWeb: {
      marginHorizontal: spacing.margin.large,
    },
    buttonEditWebContainer: {
      marginHorizontal: 0,
      borderWidth: 1,
      borderColor: colors.primary6,
    },
  });
};
