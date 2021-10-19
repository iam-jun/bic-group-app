import {useNavigation} from '@react-navigation/native';
import i18next from 'i18next';
import React, {useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import Image from '~/beinComponents/Image';
import ImagePicker from '~/beinComponents/ImagePicker';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import {IUploadType, uploadTypes} from '~/configs/resourceConfig';
import genders from '~/constants/genders';
import relationshipStatus from '~/constants/relationshipStatus';
import speakingLanguages from '~/constants/speakingLanguages';
import useMenu from '~/hooks/menu';
import {IFilePicked} from '~/interfaces/common';
import images from '~/resources/images';
import mainStack from '~/router/navigator/MainStack/stack';
import SettingItem from '~/screens/Menu/AccountSettings/EditBasicInfo/fragments/SettingItem';
import {
  scaleCoverHeight,
  scaleSize,
  userProfileImageCropRatio,
} from '~/theme/dimension';

import {ITheme} from '~/theme/interfaces';
import {formatDate} from '~/utils/formatData';
import menuActions from '../redux/actions';

const UserEditProfile = () => {
  const [coverHeight, setCoverHeight] = useState<number>(210);

  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = themeStyles(theme, coverHeight);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {myProfile, loadingAvatar, loadingCover} = useMenu();
  const {
    id,
    fullname,
    gender,
    avatar,
    background_img_url,
    birthday,
    language,
    relationship_status,
    email,
    phone,
    country_code,
    address,
  } = myProfile;

  const userLanguageList = language?.map(
    // @ts-ignore
    (code: string) => speakingLanguages[code].name,
  );
  const userLanguages = userLanguageList?.join(', ');

  const goToEditInfo = () => navigation.navigate(mainStack.editBasicInfo);

  const goToEditContact = () => navigation.navigate(mainStack.editContact);

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

  // fieldName: field name in group profile to be edited
  // 'avatar' for avatar and 'background_img_url' for cover
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

  const renderAvatar = () => {
    return (
      <View>
        <View style={styles.avatarHeader}>
          <Text.H5 color={theme.colors.iconTint} useI18n>
            settings:title_avatar
          </Text.H5>
          <ButtonWrapper onPress={onEditAvatar} disabled={loadingAvatar}>
            <Text.H6
              color={!loadingAvatar ? colors.primary7 : colors.textDisabled}
              useI18n>
              settings:title_edit
            </Text.H6>
          </ButtonWrapper>
        </View>
        <View style={styles.imageButton}>
          {!loadingAvatar ? (
            <Image
              style={styles.avatar}
              source={avatar || images.img_user_avatar_default}
            />
          ) : (
            <View style={[styles.avatar, styles.imageLoading]}>
              <ActivityIndicator />
            </View>
          )}
        </View>
        <Divider style={styles.divider} />
      </View>
    );
  };

  const renderCover = () => {
    return (
      <View>
        <View style={styles.coverHeader}>
          <Text.H5 color={theme.colors.iconTint} useI18n>
            settings:title_cover
          </Text.H5>
          <ButtonWrapper onPress={onEditCover} disabled={loadingCover}>
            <Text.H6
              color={!loadingCover ? colors.primary7 : colors.textDisabled}
              useI18n>
              settings:title_edit
            </Text.H6>
          </ButtonWrapper>
        </View>
        <View onLayout={onCoverLayout}>
          {!loadingCover ? (
            <Image
              style={styles.cover}
              source={background_img_url || images.img_cover_default}
            />
          ) : (
            <View style={[styles.cover, styles.imageLoading]}>
              <ActivityIndicator />
            </View>
          )}
        </View>
        <Divider style={styles.divider} />
      </View>
    );
  };

  const renderBasicInfo = () => {
    return (
      <View>
        <View style={styles.infoHeader}>
          <Text.H5 color={theme.colors.iconTint} useI18n>
            settings:title_basic_info
          </Text.H5>
          <ButtonWrapper onPress={goToEditInfo}>
            <Text.H6 color={theme.colors.primary7} useI18n>
              settings:title_edit
            </Text.H6>
          </ButtonWrapper>
        </View>
        <View style={styles.infoItem}>
          <SettingItem
            title={'settings:title_name'}
            subtitle={fullname || i18next.t('common:text_not_set')}
            leftIcon={'TextFields'}
            isTouchDisabled
          />
          <SettingItem
            title={'settings:title_gender'}
            subtitle={
              // @ts-ignore
              i18next.t(genders[gender]) || i18next.t('common:text_not_set')
            }
            leftIcon={'UserSquare'}
            isTouchDisabled
          />
          <SettingItem
            title={'settings:title_birthday'}
            subtitle={
              formatDate(birthday, 'MMM Do, YYYY') ||
              i18next.t('common:text_not_set')
            }
            leftIcon={'Calender'}
            isTouchDisabled
          />
          <SettingItem
            title={'settings:title_speaking_languages'}
            subtitle={userLanguages || i18next.t('common:text_not_set')}
            leftIcon={'CommentsAlt'}
            isTouchDisabled
          />
          <SettingItem
            title={'settings:title_relationship_status'}
            subtitle={
              // @ts-ignore
              i18next.t(relationshipStatus[relationship_status]) ||
              i18next.t('common:text_not_set')
            }
            leftIcon={'Heart'}
            isTouchDisabled
          />
          <Divider style={styles.divider} />
        </View>
      </View>
    );
  };

  const renderContact = () => {
    return (
      <View>
        <View style={styles.infoHeader}>
          <Text.H5 color={theme.colors.iconTint} useI18n>
            settings:title_contact
          </Text.H5>
          <ButtonWrapper onPress={goToEditContact}>
            <Text.H6 color={theme.colors.primary7} useI18n>
              settings:title_edit
            </Text.H6>
          </ButtonWrapper>
        </View>
        <View style={styles.infoItem}>
          <SettingItem
            title={'settings:title_email'}
            subtitle={email || i18next.t('common:text_not_set')}
            leftIcon={'EnvelopeAlt'}
            isTouchDisabled
          />
          <SettingItem
            title={'settings:title_phone_number'}
            subtitle={
              country_code && phone
                ? `(+${country_code}) ${phone}`
                : i18next.t('common:text_not_set')
            }
            leftIcon={'Phone'}
            isTouchDisabled
          />
          <SettingItem
            title={'settings:title_address'}
            subtitle={address || i18next.t('common:text_not_set')}
            leftIcon={'LocationPoint'}
            isTouchDisabled
          />
        </View>
        <Divider style={styles.divider} />
      </View>
    );
  };

  return (
    <ScreenWrapper testID="UserEditProfile" style={styles.container} isFullView>
      <Header title={i18next.t('settings:title_user_profile')} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderAvatar()}
        {renderCover()}
        {renderBasicInfo()}
        {renderContact()}
      </ScrollView>
    </ScreenWrapper>
  );
};

export default UserEditProfile;

const themeStyles = (theme: ITheme, coverHeight: number) => {
  const {spacing, colors} = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
    },
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
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    avatar: {
      width: scaleSize(96),
      height: scaleSize(96),
      maxHeight: 125,
      maxWidth: 125,
      borderRadius: 8,
    },
    imageLoading: {
      backgroundColor: colors.bgDisable,
      justifyContent: 'center',
    },
    cover: {
      width: '100%',
      height: coverHeight,
    },
    infoItem: {
      marginHorizontal: spacing.margin.tiny,
    },
    imageButton: {
      alignItems: 'center',
    },
    divider: {
      marginVertical: spacing.margin.small,
    },
  });
};
