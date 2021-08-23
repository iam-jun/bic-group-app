import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {useBaseHook} from '~/hooks';
import {ITheme} from '~/theme/interfaces';
import {scaleSize} from '~/theme/dimension';
import * as modalActions from '~/store/modal/actions';
import useMenu from '~/hooks/menu';
import images from '~/resources/images';
import {IUserProfile} from '~/interfaces/IAuth';
import menuActions from '~/screens/Menu/redux/actions';
import {useRootNavigation} from '~/hooks/navigation';

import Header from '~/beinComponents/Header';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Text from '~/beinComponents/Text';
import Divider from '~/beinComponents/Divider';
import Image from '~/beinComponents/Image';
import Button from '~/beinComponents/Button';
import AboutProfile from '../MyProfilePage/components/AboutProfile';
import menuStack from '~/router/navigator/MainStack/MenuStack/stack';

const ProfileInfo = ({
  fullname,
  description,
  avatar,
  background_img_url,
  email,
  address,
  language,
  phone,
  isPublic,
}: IUserProfile) => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();

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

  const onEditProfileButton = () =>
    rootNavigation.navigate(menuStack.userProfile);

  return (
    <View>
      <Header />
      <ButtonWrapper>
        <Image
          style={styles.cover}
          resizeMode="cover"
          source={background_img_url || images.img_cover_default}
        />
      </ButtonWrapper>
      <ButtonWrapper style={styles.imageButton}>
        <Image
          style={styles.avatar}
          resizeMode="cover"
          source={avatar || images.img_user_avatar_default}
        />
      </ButtonWrapper>
      <View style={styles.headerName}>
        <Text.H5>{fullname}</Text.H5>
        <Text.Body style={styles.subtitleText}>{description}</Text.Body>
      </View>

      {isPublic ? (
        <Button.Secondary
          style={styles.button}
          color={theme.colors.primary7}
          textColor={theme.colors.background}
          rightIcon={'Message'}
          onPress={popupMessage}>
          {t('profile:title_direct_message')}
        </Button.Secondary>
      ) : (
        <Button.Secondary
          style={styles.button}
          color={theme.colors.bgButtonSecondary}
          textColor={theme.colors.primary}
          rightIcon={'EditAlt'}
          onPress={onEditProfileButton}>
          {t('profile:title_edit_profile')}
        </Button.Secondary>
      )}
      <Divider style={styles.divider} />

      <AboutProfile
        email={email}
        address={address}
        language={language}
        phone={phone}
        isPublic={isPublic}
      />
    </View>
  );
};

export default ProfileInfo;

const themeStyles = (theme: ITheme) => {
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
      width: scaleSize(375),
      height: scaleSize(136),
      maxHeight: 250,
      maxWidth: 525,
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
