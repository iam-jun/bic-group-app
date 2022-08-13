import i18next from 'i18next';
import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import Avatar from '~/baseComponents/Avatar';
import BottomSheet from '~/beinComponents/BottomSheet';
import Button from '~/beinComponents/Button';
import Icon from '~/beinComponents/Icon';
import Image from '~/beinComponents/Image';
import Text from '~/beinComponents/Text';
import speakingLanguages from '~/constants/speakingLanguages';
import { useRootNavigation } from '~/hooks/navigation';
import { useKeySelector } from '~/hooks/selector';
import { IObject } from '~/interfaces/common';
import { IconType } from '~/resources/icons';
import images from '~/resources/images';
import mainStack from '~/router/navigator/MainStack/stack';
import menuActions from '~/screens/Menu/redux/actions';
import menuKeySelector from '~/screens/Menu/redux/keySelector';
import modalActions from '~/store/modal/actions';
import commonKeySelector from '~/store/modal/keySelector';
import { scaleCoverHeight } from '~/theme/dimension';

import spacing from '~/theme/spacing';
import { uuidRegex } from '~/constants/commonRegex';

const UserProfilePreviewBottomSheet = () => {
  const theme: ExtendedTheme = useTheme();
  const [coverHeight, setCoverHeight] = useState<number>(210);
  const styles = themeStyles(
    theme, coverHeight,
  );
  const userPreviewRef: any = useRef();
  const { rootNavigation } = useRootNavigation();

  const dispatch = useDispatch();

  const bottomSheetData = useKeySelector(commonKeySelector.userProfilePreviewBottomSheet);
  const {
    isOpen, userId, params, position,
  } = bottomSheetData || {};

  const loadingUserProfile = useKeySelector(menuKeySelector.loadingUserProfile);

  const userProfileData = useKeySelector(menuKeySelector.userProfile);
  const {
    fullname, description, avatar, backgroundImgUrl, language, phone,
  } = userProfileData || {};

  const userLanguageList = language?.map((code: string) => speakingLanguages[code].name);
  const userLanguages = userLanguageList?.join(', ');

  const showUserBasicInfo = !!phone || !isEmpty(language);

  const onClose = () => {
    dispatch(modalActions.hideUserProfilePreviewBottomSheet());
  };

  const getUserProfile = () => {
    dispatch(menuActions.clearUserProfile());
    if (userId) dispatch(menuActions.getUserProfile({ userId, params }));
  };

  useEffect(
    () => {
      isOpen && getUserProfile();
    }, [userId],
  );

  const renderLoading = () => (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );

  const navigateToUserProfile = () => {
    if (userId) {
      // Double check if userId is username, and lack of type in params
      const _params: IObject<unknown> = {
        ...params,
      };
      if (!uuidRegex.test(userId) && _params?.type !== 'username') _params.type = 'username';

      const payload = { userId, params: _params };
      rootNavigation.navigate(
        mainStack.userProfile, payload,
      );
    }
    userPreviewRef?.current?.close?.();
  };

  const onCoverLayout = (e: any) => {
    if (!e?.nativeEvent?.layout?.width) return;
    const coverWidth = e.nativeEvent.layout.width;
    const coverHeight = scaleCoverHeight(coverWidth);
    setCoverHeight(coverHeight);
  };

  const renderCoverImage = () => (
    <View onLayout={onCoverLayout}>
      <Image
        style={styles.cover}
        source={backgroundImgUrl || images.img_cover_default}
      />
    </View>
  );

  const renderAvatar = () => (
    <TouchableOpacity onPress={navigateToUserProfile} style={styles.avatar}>
      <Avatar.XLarge
        source={avatar || images.img_user_avatar_default}
      />
    </TouchableOpacity>
  );

  const renderUserHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={navigateToUserProfile}>
        <Text.H5>{fullname}</Text.H5>
      </TouchableOpacity>
      {!!description && <Text.BodyM>{description}</Text.BodyM>}
    </View>
  );

  const renderButtons = () => (
    <View style={styles.buttonsContainer}>
      <Button.Secondary
        onPress={navigateToUserProfile}
        style={styles.button}
        leftIcon="SquareUser"
        leftIconProps={{ icon: 'SquareUser', size: 17 }}
      >
        {i18next.t('profile:title_view_profile')}
      </Button.Secondary>
    </View>
  );

  const renderInfoItem = (
    icon: IconType, content?: string,
  ) => {
    if (!content) return null;

    return (
      <View style={styles.infoItem}>
        <Icon
          icon={icon}
          tintColor={theme.colors.purple30}
          size={24}
          style={styles.infoItemIcon}
        />
        <Text.BodyM style={styles.infoItemContent} useI18n>
          {content}
        </Text.BodyM>
      </View>
    );
  };

  const renderBasicInfo = () => (
    <View style={styles.basicInfoContainer}>
      {renderInfoItem(
        'Comments', userLanguages,
      )}
      {renderInfoItem(
        'Phone', phone,
      )}
    </View>
  );

  const renderUserProfile = () => (
    <View style={styles.container}>
      {renderCoverImage()}
      {renderAvatar()}
      {renderUserHeader()}
      {renderButtons()}
      {showUserBasicInfo && renderBasicInfo()}
    </View>
  );

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

const themeStyles = (
  theme: ExtendedTheme, coverHeight: number,
) => {
  const { colors } = theme;
  const containerMinHeight = 330;

  return StyleSheet.create({
    container: {
      minHeight: containerMinHeight,
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
      padding: spacing.padding.large,
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
      borderTopColor: colors.neutral5,
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
