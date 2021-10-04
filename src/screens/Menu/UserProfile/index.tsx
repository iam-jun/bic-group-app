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

import {ITheme} from '~/theme/interfaces';
import {scaleSize, scaleCoverHeight} from '~/theme/dimension';
import images from '~/resources/images';
import {useRootNavigation} from '~/hooks/navigation';
import chatActions from '~/screens/Chat/redux/actions';
import AboutProfile from './components/AboutProfile';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import menuActions from '../redux/actions';
import {useKeySelector} from '~/hooks/selector';
import menuKeySelector from '../redux/keySelector';
import {useUserIdAuth} from '~/hooks/auth';
import NoUserFound from '~/screens/Menu/fragments/NoUserFound';
import mainStack from '~/router/navigator/MainStack/stack';
import Avatar from '~/beinComponents/Avatar';

const UserProfile = (props: any) => {
  const {userId, params} = props?.route?.params || {};

  const userProfileData = useKeySelector(menuKeySelector.userProfile);
  const {fullname, description, avatar, background_img_url, username} =
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

  const navigateToChatScreen = (roomId: string) =>
    rootNavigation.navigate('chat', {
      screen: chatStack.conversation,
      params: {roomId, initial: false},
    });

  const getUserProfile = () => {
    dispatch(menuActions.clearUserProfile());
    if (!!userId) dispatch(menuActions.getUserProfile({userId, params}));
  };

  useEffect(() => {
    isFocused && getUserProfile();
  }, [isFocused]);

  const onPressChat = () => {
    if (!!username)
      dispatch(
        chatActions.createConversation(
          // @ts-ignore
          [{username, name: fullname}],
          true,
          navigateToChatScreen,
        ),
      );
  };

  const onEditProfileButton = () => rootNavigation.navigate(mainStack.userEdit);

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
      <View style={styles.imageButton}>
        <Avatar.UltraSuperLarge
          style={styles.avatar}
          source={avatar || images.img_user_avatar_default}
        />
      </View>
    );
  };

  const renderUserHeader = () => {
    return (
      <View style={styles.headerName}>
        <Text.H5>{fullname}</Text.H5>
        <Text.Body style={styles.subtitleText}>{description}</Text.Body>
      </View>
    );
  };

  const renderButton = () => {
    return userId == currentUserId || userId == currentUsername ? (
      <Button.Secondary
        style={styles.button}
        rightIcon={'EditAlt'}
        onPress={onEditProfileButton}>
        {i18next.t('profile:title_edit_profile')}
      </Button.Secondary>
    ) : (
      <Button.Secondary
        style={styles.button}
        highEmphasis
        rightIcon={'Message'}
        onPress={onPressChat}>
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
      marginTop: -30,
    },
    avatar: {
      width: scaleSize(96),
      height: scaleSize(96),
      maxHeight: 125,
      maxWidth: 125,
      borderRadius: 8,
    },
    headerName: {
      alignItems: 'center',
      marginVertical: spacing.margin.small,
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
  });
};
