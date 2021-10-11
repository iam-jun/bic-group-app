import i18next from 'i18next';
import {isEmpty} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Platform, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import Avatar from '~/beinComponents/Avatar';
import BottomSheet from '~/beinComponents/BottomSheet';
import Button from '~/beinComponents/Button';
import Icon from '~/beinComponents/Icon';
import Image from '~/beinComponents/Image';
import Text from '~/beinComponents/Text';
import speakingLanguages from '~/constants/speakingLanguages';
import {useUserIdAuth} from '~/hooks/auth';
import {useRootNavigation} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import {IconType} from '~/resources/icons';
import images from '~/resources/images';
import chatStack from '~/router/navigator/MainStack/ChatStack/stack';
import mainStack from '~/router/navigator/MainStack/stack';
import chatActions from '~/screens/Chat/redux/actions';
import menuActions from '~/screens/Menu/redux/actions';
import menuKeySelector from '~/screens/Menu/redux/keySelector';
import modalActions from '~/store/modal/actions';
import commonKeySelector from '~/store/modal/keySelector';
import {scaleCoverHeight} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';

const UserProfilePreviewBottomSheet = () => {
  const theme = useTheme() as ITheme;
  const [coverHeight, setCoverHeight] = useState<number>(210);
  const styles = themeStyles(theme, coverHeight);
  const userPreviewRef: any = useRef();
  const {rootNavigation} = useRootNavigation();

  const dispatch = useDispatch();

  const bottomSheetData = useKeySelector(
    commonKeySelector.userProfilePreviewBottomSheet,
  );
  const {isOpen, userId, params, position} = bottomSheetData || {};

  const currentUserId = useUserIdAuth();
  const myProfileData = useKeySelector(menuKeySelector.myProfile);
  const {username: currentUsername} = myProfileData || {};

  const loadingUserProfile = useKeySelector(menuKeySelector.loadingUserProfile);

  const userProfileData = useKeySelector(menuKeySelector.userProfile);
  const {
    fullname,
    description,
    avatar,
    background_img_url,
    language,
    phone,
    username,
  } = userProfileData || {};

  const userLanguageList = language?.map(
    // @ts-ignore
    (code: string) => speakingLanguages[code].name,
  );
  const userLanguages = userLanguageList?.join(', ');

  const showUserBasicInfo = !!phone || !isEmpty(language);

  const onClose = () => {
    dispatch(modalActions.hideUserProfilePreviewBottomSheet());
  };

  const getUserProfile = () => {
    dispatch(menuActions.clearUserProfile());
    if (!!userId) dispatch(menuActions.getUserProfile({userId, params}));
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

  const navigateToChatScreen = (roomId: string) =>
    rootNavigation.navigate('chat', {
      screen: chatStack.conversation,
      params: {roomId, initial: false},
    });

  const navigateToChat = () => {
    if (!!username)
      dispatch(
        chatActions.createConversation(
          // @ts-ignore
          [{username, name: fullname}],
          true,
          navigateToChatScreen,
        ),
      );
    userPreviewRef?.current?.close?.();
  };

  const navigateToUserProfile = () => {
    if (!!userId) {
      const payload = {userId, params};
      rootNavigation.navigate(mainStack.userProfile, payload);
    }
    userPreviewRef?.current?.close?.();
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
      <TouchableOpacity onPress={navigateToUserProfile} style={styles.avatar}>
        <Avatar.UltraSuperLarge
          source={avatar || images.img_user_avatar_default}
        />
      </TouchableOpacity>
    );
  };

  const renderUserHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={navigateToUserProfile}>
          <Text.H5>{fullname}</Text.H5>
        </TouchableOpacity>
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
            onPress={navigateToChat}
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
          onPress={navigateToUserProfile}
          style={styles.button}
          leftIcon={'UserSquare'}
          leftIconProps={{icon: 'UserSquare', size: 17}}>
          {i18next.t('profile:title_view_profile')}
        </Button.Secondary>
      </View>
    );
  };

  const renderInfoItem = (icon: IconType, content?: string) => {
    if (!content) return null;

    return (
      <View style={styles.infoItem}>
        <Icon
          icon={icon}
          tintColor={theme.colors.primary5}
          size={24}
          style={styles.infoItemIcon}
        />
        <Text.Body style={styles.infoItemContent} useI18n>
          {content}
        </Text.Body>
      </View>
    );
  };

  const renderBasicInfo = () => {
    return (
      <View style={styles.basicInfoContainer}>
        {renderInfoItem('CommentsAlt', userLanguages)}
        {renderInfoItem('Phone', phone)}
      </View>
    );
  };

  const renderUserProfile = () => {
    return (
      <View style={styles.container}>
        {renderCoverImage()}
        {renderAvatar()}
        {renderUserHeader()}
        {renderButtons()}
        {showUserBasicInfo && renderBasicInfo()}
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
  const containerMinHeight = 330;

  return StyleSheet.create({
    container: {
      minHeight: containerMinHeight,
      ...Platform.select({
        web: {
          width: 375,
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
    },
    headerContainer: {
      alignItems: 'center',
      marginVertical: spacing.margin.small,
    },
    buttonsContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      height: 68,
      padding: spacing.padding.large,
    },
    button: {
      flex: 1,
      height: 36,
      marginHorizontal: spacing.margin.tiny,
    },
    basicInfoContainer: {
      marginBottom: spacing.margin.tiny,
      paddingTop: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
      borderTopColor: colors.borderDivider,
      borderTopWidth: 1,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 32,
      // Add margin right => avoid text going out of the container
      marginRight: spacing.margin.base,
    },
    infoItemIcon: {
      marginRight: spacing.margin.large,
    },
    infoItemContent: {},
  });
};

export default UserProfilePreviewBottomSheet;
