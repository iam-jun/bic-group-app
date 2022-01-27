import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView, ActivityIndicator} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import i18next from 'i18next';
import {useIsFocused} from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import Divider from '~/beinComponents/Divider';
import Image from '~/beinComponents/Image';
import Button from '~/beinComponents/Button';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import Avatar from '~/beinComponents/Avatar';

import {ITheme} from '~/theme/interfaces';
import {scaleSize, scaleCoverHeight} from '~/theme/dimension';
import images from '~/resources/images';
import {useRootNavigation} from '~/hooks/navigation';
import AboutProfile from './components/AboutProfile';
import menuActions from '../redux/actions';
import {useKeySelector} from '~/hooks/selector';
import menuKeySelector from '../redux/keySelector';
import {useUserIdAuth} from '~/hooks/auth';
import NoUserFound from '~/screens/Menu/fragments/NoUserFound';
import mainStack from '~/router/navigator/MainStack/stack';
import Icon from '~/beinComponents/Icon';

const UserProfile = (props: any) => {
  const {userId, params} = props?.route?.params || {};

  const userProfileData = useKeySelector(menuKeySelector.userProfile);
  const {fullname, description, avatar, background_img_url, email} =
    userProfileData || {};
  const loadingUserProfile = useKeySelector(menuKeySelector.loadingUserProfile);

  const myProfileData = useKeySelector(menuKeySelector.myProfile);
  const {username: currentUsername} = myProfileData || {};
  const showUserNotFound = useKeySelector(menuKeySelector.showUserNotFound);

  const [coverHeight, setCoverHeight] = useState<number>(210);

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
  }, [isFocused, userId]);

  const onEditProfileButton = () => rootNavigation.navigate(mainStack.userEdit);

  const onCoverLayout = (e: any) => {
    if (!e?.nativeEvent?.layout?.width) return;
    const coverWidth = e.nativeEvent.layout.width;
    const coverHeight = scaleCoverHeight(coverWidth);
    setCoverHeight(coverHeight);
  };

  const renderEditButton = (style: any) => {
    return userId == currentUserId || userId == currentUsername ? (
      <View style={[styles.editButton, style]}>
        <Icon size={16} tintColor={theme.colors.primary7} icon={'Camera'} />
      </View>
    ) : null;
  };

  const renderCoverImage = () => {
    return (
      <View onLayout={onCoverLayout}>
        <Image
          style={styles.cover}
          source={background_img_url || images.img_cover_default}
        />
        {renderEditButton(styles.editCoverPhoto)}
      </View>
    );
  };

  const renderAvatar = () => {
    return (
      <View style={styles.imageButton}>
        <View>
          <Avatar.UltraSuperLarge
            style={styles.avatar}
            source={avatar || images.img_user_avatar_default}
            isRounded={true}
          />
          {renderEditButton(styles.editAvatar)}
        </View>
      </View>
    );
  };

  const renderUserHeader = () => {
    return (
      <View style={styles.headerName}>
        <Text.H5 style={{fontSize: scaleSize(18)}}>{fullname}</Text.H5>
        <Text.Subtitle>{email}</Text.Subtitle>
        <Text.Body style={styles.subtitleText}>{description}</Text.Body>
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
        onPress={onEditProfileButton}>
        {i18next.t('profile:title_edit_profile')}
      </Button.Secondary>
    ) : (
      <Button.Secondary
        testID="user_profile.message"
        style={styles.button}
        highEmphasis
        rightIcon={'Message'}>
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

          <Divider style={styles.divider} />
          <AboutProfile {...userProfileData} />
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
      width: scaleSize(100),
      height: scaleSize(100),
      maxHeight: 125,
      maxWidth: 125,
      borderWidth: 4,
      borderColor: colors.background,
      borderRadius: scaleSize(100) / 2,
    },
    headerName: {
      alignItems: 'center',
      marginVertical: spacing.margin.base,
    },
    subtitleText: {
      marginVertical: spacing.margin.tiny,
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
