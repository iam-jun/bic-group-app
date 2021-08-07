import React, {useEffect} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {useBaseHook} from '~/hooks';
import {ITheme} from '~/theme/interfaces';
import {scaleSize} from '~/theme/dimension';
import * as modalActions from '~/store/modal/actions';
import useMenu from '~/hooks/menu';
import menuActions from '~/screens/Menu/redux/actions';
import {IconType} from '~/resources/icons';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Text from '~/beinComponents/Text';
import Divider from '~/beinComponents/Divider';
import Image from '~/beinComponents/Image';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Icon from '~/beinComponents/Icon';
import images from '~/resources/images';

const UserProfile = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const menuData = useMenu();
  const {userProfile} = menuData;
  const {fullname, gender, avatar, background_img_url, birthday, language} =
    userProfile;

  const renderItem = (
    title: string,
    subtitle: string,
    leftIcon: IconType,
    privacyIcon: IconType,
  ) => {
    return (
      <PrimaryItem
        title={t(title)}
        subTitle={subtitle}
        LeftComponent={
          <Icon
            style={styles.leftIcon}
            icon={leftIcon}
            tintColor={theme.colors.primary7}
          />
        }
        RightComponent={
          <>
            <ButtonWrapper onPress={popupMessage}>
              <Icon icon={privacyIcon} />
            </ButtonWrapper>
            <ButtonWrapper onPress={popupMessage}>
              <Icon icon={'EditAlt'} style={styles.rightEditIcon} />
            </ButtonWrapper>
          </>
        }
      />
    );
  };

  const popupMessage = () =>
    dispatch(
      modalActions.showAlert({
        title: 'Info',
        content:
          'Function has not been developed. Stay tuned for further releases 😀',
        onConfirm: () => dispatch(modalActions.hideAlert()),
        confirmLabel: 'Got it',
      }),
    );

  useEffect(() => {
    dispatch(menuActions.getUserProfile());
  }, []);

  return (
    <ScreenWrapper testID="UserProfile" style={styles.container} isFullView>
      <Header title={t('settings:title_about')} />
      <ScrollView>
        {/* --- AVATAR --- */}
        <View style={styles.avatarHeader}>
          <Text.H5 color={theme.colors.iconTint}>Avatar</Text.H5>
          <ButtonWrapper onPress={popupMessage}>
            <Text.H6 color={theme.colors.primary7}>Edit</Text.H6>
          </ButtonWrapper>
        </View>
        <ButtonWrapper onPress={popupMessage} style={styles.imageButton}>
          <Image
            style={styles.avatar}
            source={avatar ? {uri: avatar} : images.img_user_avatar_default}
          />
        </ButtonWrapper>
        <Divider style={styles.divider} />

        {/* --- COVER --- */}
        <View style={styles.coverHeader}>
          <Text.H5 color={theme.colors.iconTint}>Cover</Text.H5>
          <ButtonWrapper onPress={popupMessage}>
            <Text.H6 color={theme.colors.primary7}>Edit</Text.H6>
          </ButtonWrapper>
        </View>
        <ButtonWrapper onPress={popupMessage}>
          <Image
            style={styles.cover}
            source={
              background_img_url
                ? {uri: background_img_url}
                : images.img_cover_default
            }
          />
        </ButtonWrapper>
        <Divider style={styles.divider} />

        {/* --- BASIC INFO --- */}
        <View style={styles.infoHeader}>
          <Text.H5 color={theme.colors.iconTint}>Basic Info</Text.H5>
        </View>
        <View style={styles.basicInfoList}>
          {renderItem('settings:title_name', fullname, 'TextFields', 'Globe')}
          {renderItem('settings:title_gender', gender, 'UserSquare', 'Lock')}
          {renderItem('settings:title_birthday', birthday, 'Calender', 'Lock')}
          {renderItem(
            'settings:title_language',
            language,
            'CommentsAlt',
            'Lock',
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default UserProfile;

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    container: {},
    list: {
      marginTop: spacing.margin.base,
    },
    avatarHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.small,
    },
    coverHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.small,
    },
    infoHeader: {
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.small,
    },
    avatar: {
      width: scaleSize(96),
      height: scaleSize(96),
      borderRadius: 8,
    },
    cover: {
      width: scaleSize(375),
      height: scaleSize(136),
    },
    basicInfoList: {
      marginHorizontal: spacing.margin.tiny,
    },
    leftIcon: {
      marginRight: theme.spacing.margin.extraLarge,
    },
    rightEditIcon: {
      marginLeft: theme.spacing.margin.extraLarge,
    },
    imageButton: {
      alignItems: 'center',
    },
    divider: {
      marginVertical: theme.spacing.margin.small,
    },
  });
};
