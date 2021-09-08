import React, {useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import i18next from 'i18next';

import {ITheme} from '~/theme/interfaces';
import {scaleSize} from '~/theme/dimension';
import images from '~/resources/images';
import {IUserProfile} from '~/interfaces/IAuth';
import {useRootNavigation} from '~/hooks/navigation';
import {scaleCoverHeight} from '~/theme/dimension';
import menuStack from '~/router/navigator/MainStack/MenuStack/stack';
import chatActions from '~/screens/Chat/redux/actions';

import Text from '~/beinComponents/Text';
import Divider from '~/beinComponents/Divider';
import Image from '~/beinComponents/Image';
import Button from '~/beinComponents/Button';
import AboutProfile from './components/AboutProfile';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';

const ProfileInfo = (props: IUserProfile) => {
  const [coverHeight, setCoverHeight] = useState<number>(210);

  const {
    fullname,
    description,
    avatar,
    background_img_url,
    isPublic,
    username,
  } = props;

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme, coverHeight);
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

  const navigateToChatScreen = (roomId: string) =>
    rootNavigation.navigate('chat', {
      screen: chatStack.conversation,
      params: {roomId},
    });

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

  const onEditProfileButton = () =>
    rootNavigation.navigate('menus', {
      screen: menuStack.userProfile,
    });

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
        <Image
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
    return isPublic ? (
      <Button.Secondary
        style={styles.button}
        color={theme.colors.primary7}
        textColor={theme.colors.background}
        rightIcon={'Message'}
        onPress={onPressChat}>
        {i18next.t('profile:title_direct_message')}
      </Button.Secondary>
    ) : (
      <Button.Secondary
        style={styles.button}
        color={theme.colors.bgButtonSecondary}
        textColor={theme.colors.primary}
        rightIcon={'EditAlt'}
        onPress={onEditProfileButton}>
        {i18next.t('profile:title_edit_profile')}
      </Button.Secondary>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderCoverImage()}
      {renderAvatar()}
      {renderUserHeader()}
      {renderButton()}

      <Divider style={styles.divider} />
      <AboutProfile {...props} />
    </ScrollView>
  );
};

export default ProfileInfo;

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
  });
};
