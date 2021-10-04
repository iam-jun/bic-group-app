import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, View, StyleSheet, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import i18next from 'i18next';

import {ITheme} from '~/theme/interfaces';
import {useKeySelector} from '~/hooks/selector';
import modalActions from '~/store/modal/actions';
import commonKeySelector from '~/store/modal/keySelector';
import BottomSheet from '~/beinComponents/BottomSheet';
import Text from '~/beinComponents/Text';
import menuActions from '~/screens/Menu/redux/actions';
import menuKeySelector from '~/screens/Menu/redux/keySelector';
import {scaleCoverHeight, scaleSize} from '~/theme/dimension';
import Image from '~/beinComponents/Image';
import images from '~/resources/images';
import {useUserIdAuth} from '~/hooks/auth';
import Button from '~/beinComponents/Button';

const UserProfilePreviewBottomSheet = () => {
  const theme = useTheme() as ITheme;
  const [coverHeight, setCoverHeight] = useState<number>(210);
  const styles = themeStyles(theme, coverHeight);
  const userPreviewRef: any = useRef();

  const dispatch = useDispatch();

  const bottomSheetData = useKeySelector(
    commonKeySelector.userProfilePreviewBottomSheet,
  );
  const {isOpen, userId, position} = bottomSheetData || {};

  const currentUserId = useUserIdAuth();
  const myProfileData = useKeySelector(menuKeySelector.myProfile);
  const {username: currentUsername} = myProfileData || {};

  const loadingUserProfile = useKeySelector(menuKeySelector.loadingUserProfile);

  const userProfileData = useKeySelector(menuKeySelector.userProfile);
  const {address, fullname, description, avatar, background_img_url} =
    userProfileData || {};

  const onClose = () => {
    dispatch(modalActions.hideUserProfilePreviewBottomSheet());
  };

  const getUserProfile = () => {
    dispatch(menuActions.clearUserProfile());
    if (!!userId) dispatch(menuActions.getUserProfile({userId}));
  };

  useEffect(() => {
    isOpen && getUserProfile();
  }, [userId]);

  const renderLoading = () => {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  const onPressChat = () => {
    console.log('[DEBUG] chat pressed');
  };

  const onPressViewProfile = () => {
    console.log('[DEBUG], view profile');
  };

  const onCoverLayout = (e: any) => {
    if (!e?.nativeEvent?.layout?.width) return;
    const coverWidth = e.nativeEvent.layout.width;
    const coverHeight = scaleCoverHeight(coverWidth);
    setCoverHeight(coverHeight);
  };

  const renderCoverImage = () => {
    return (
      <View onLayout={onCoverLayout}>
        <Image
          style={styles.cover}
          source={background_img_url || images.img_cover_default}
        />
      </View>
    );
  };

  const renderAvatar = () => {
    return (
      <Image
        style={styles.avatar}
        source={avatar || images.img_user_avatar_default}
      />
    );
  };

  const renderUserHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Text.H5>{fullname}</Text.H5>
        {!!description && <Text.Body>{description}</Text.Body>}
      </View>
    );
  };

  const renderButtons = () => {
    const hideButtonChat =
      userId === currentUserId || userId === currentUsername;

    return (
      <View style={styles.buttonsContainer}>
        {!hideButtonChat && (
          <Button.Secondary
            onPress={onPressChat}
            style={styles.button}
            leftIcon={'iconChatPurple'}
            leftIconProps={{
              icon: 'iconChatPurple',
              size: 16,
              tintColor: 'none',
            }}>
            {i18next.t('profile:title_direct_message')}
          </Button.Secondary>
        )}
        <Button.Secondary
          onPress={onPressViewProfile}
          style={styles.button}
          leftIcon={'iconUserProfile'}
          leftIconProps={{
            icon: 'iconUserProfile',
            size: 16,
            tintColor: 'none',
          }}>
          {i18next.t('profile:title_view_profile')}
        </Button.Secondary>
      </View>
    );
  };

  const renderUserProfile = () => {
    console.log('[DEBUG] userProfileData', userProfileData);
    return (
      <View style={styles.container}>
        {renderCoverImage()}
        {renderAvatar()}
        {renderUserHeader()}
        {renderButtons()}
        <Text.Body>Address, {address}</Text.Body>
      </View>
    );
  };

  return (
    <BottomSheet
      modalizeRef={userPreviewRef}
      isOpen={isOpen}
      position={position}
      onClose={onClose}
      ContentComponent={
        loadingUserProfile ? renderLoading() : renderUserProfile()
      }
    />
  );
};

const themeStyles = (theme: ITheme, coverHeight: number) => {
  const {colors, spacing} = theme;
  const containerMinHeight = 350;

  return StyleSheet.create({
    container: {
      minHeight: containerMinHeight,
      ...Platform.select({
        web: {
          width: 800,
          height: 600,
        },
      }),
    },
    cover: {
      width: '100%',
      height: coverHeight,
    },
    avatar: {
      alignSelf: 'center',
      marginTop: -36,
      width: scaleSize(96),
      height: scaleSize(96),
      maxHeight: 125,
      maxWidth: 125,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.background,
    },
    headerContainer: {
      alignItems: 'center',
      marginVertical: spacing.margin.small,
    },
    buttonsContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      padding: spacing.padding.large,
    },
    button: {
      flex: 1,
      marginHorizontal: spacing.margin.tiny,
    },
  });
};

export default UserProfilePreviewBottomSheet;
