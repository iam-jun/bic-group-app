import React, {useEffect} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {useBaseHook} from '~/hooks';
import {ITheme} from '~/theme/interfaces';
import {scaleSize} from '~/theme/dimension';
import * as modalActions from '~/store/modal/actions';
import useMenu from '~/hooks/menu';
import images from '~/resources/images';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Text from '~/beinComponents/Text';
import Divider from '~/beinComponents/Divider';
import Image from '~/beinComponents/Image';
import Button from '~/beinComponents/Button';
import AboutProfile from './components/AboutProfile';

const MyProfilePage = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const menuData = useMenu();
  const {userProfile} = menuData;
  const {fullname, background_img_url, avatar, description} = userProfile;

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

  return (
    <ScreenWrapper testID="MyProfilePage" style={styles.container} isFullView>
      <Header />
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

      <ButtonWrapper onPress={popupMessage} style={styles.imageButton}>
        <Image
          style={styles.avatar}
          source={avatar ? {uri: avatar} : images.img_user_avatar_default}
        />
      </ButtonWrapper>

      <View style={styles.headerName}>
        <Text.H5>{fullname}</Text.H5>
        <Text.Body style={styles.subtitleText}>{description}</Text.Body>
      </View>

      <Button.Secondary
        style={styles.editButton}
        color={theme.colors.bgButtonSecondary}
        onPress={popupMessage}>
        {t('settings:title_edit_public_info')}
      </Button.Secondary>
      <Divider style={styles.divider} />

      <AboutProfile />
    </ScreenWrapper>
  );
};

export default MyProfilePage;

const themeStyles = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {},
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
      width: scaleSize(375),
      height: scaleSize(136),
    },
    imageButton: {
      alignItems: 'center',
      marginTop: -30,
    },
    avatar: {
      width: scaleSize(96),
      height: scaleSize(96),
      borderRadius: 8,
    },
    headerName: {
      alignItems: 'center',
      marginVertical: spacing.margin.small,
    },
    subtitleText: {
      marginVertical: spacing.margin.tiny,
    },
    editButton: {
      marginHorizontal: spacing.margin.large,
    },
  });
};
