import React, {useState} from 'react';
import {StyleSheet, View, ScrollView, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import i18next from 'i18next';

import {ITheme} from '~/theme/interfaces';
import {scaleSize, userProfileImageCropRatio} from '~/theme/dimension';
import useMenu from '~/hooks/menu';
import images from '~/resources/images';
import SettingItem from '~/screens/Menu/AccountSettings/EditBasicInfo/fragments/SettingItem';
import menuStack from '~/router/navigator/MainStack/MenuStack/stack';
import {formatDate} from '~/utils/formatData';
import speakingLanguages from '~/constants/speakingLanguages';
import relationshipStatus from '~/constants/relationshipStatus';
import genders from '~/constants/genders';
import {validateFile} from '~/utils/validation';
import {IFileResponse} from '~/interfaces/common';
import menuActions from '../redux/actions';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Text from '~/beinComponents/Text';
import Divider from '~/beinComponents/Divider';
import Image from '~/beinComponents/Image';
import ImagePicker from '~/beinComponents/ImagePicker';

const UserProfile = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {myProfile} = useMenu();
  const {
    id,
    fullname,
    gender,
    avatar,
    background_img_url,
    birthday,
    language,
    relationship_status,
  } = myProfile;

  const [error, setError] = useState<string | null>(null);

  const userLanguageList = language.map(
    // @ts-ignore
    (code: string) => speakingLanguages[code].name,
  );
  const userLanguages = userLanguageList.join(', ');

  const goToEditInfo = () => navigation.navigate(menuStack.editBasicInfo);

  const uploadFile = (
    file: IFileResponse,
    fieldName: 'avatar' | 'background_img_url',
  ) => {
    dispatch(
      menuActions.uploadImage({
        id,
        image: file,
        fieldName,
      }),
    );
  };

  // fieldName: field name in group profile to be edited
  // 'avatar' for avatar and 'background_img_url' for cover
  const _openImagePicker = (fieldName: 'avatar' | 'background_img_url') => {
    ImagePicker.openPicker({
      ...userProfileImageCropRatio[fieldName],
      cropping: true,
      mediaType: 'photo',
      multiple: false,
    }).then(result => {
      if (!result) return;

      const file = {
        name: result.filename,
        size: result.size,
        type: result.mime,
        uri: result.path,
      };
      const _error = validateFile(file);
      setError(_error);
      if (_error) return;
      // @ts-ignore
      uploadFile(Platform.OS === 'web' ? result : file, fieldName);
    });
  };

  const onEditAvatar = () => _openImagePicker('avatar');

  const onEditCover = () => _openImagePicker('background_img_url');

  const renderAvatar = () => {
    return (
      <View>
        <View style={styles.avatarHeader}>
          <Text.H5 color={theme.colors.iconTint} useI18n>
            settings:title_avatar
          </Text.H5>
          <ButtonWrapper onPress={onEditAvatar}>
            <Text.H6 color={theme.colors.primary7} useI18n>
              settings:title_edit
            </Text.H6>
          </ButtonWrapper>
        </View>
        <ButtonWrapper style={styles.imageButton}>
          <Image
            resizeMode="cover"
            style={styles.avatar}
            source={avatar || images.img_user_avatar_default}
          />
        </ButtonWrapper>
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
          <ButtonWrapper onPress={onEditCover}>
            <Text.H6 color={theme.colors.primary7} useI18n>
              settings:title_edit
            </Text.H6>
          </ButtonWrapper>
        </View>
        <ButtonWrapper>
          <Image
            resizeMode="cover"
            style={styles.cover}
            source={background_img_url || images.img_cover_default}
          />
        </ButtonWrapper>
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
        <View style={styles.basicInfoList}>
          <SettingItem
            title={'settings:title_name'}
            subtitle={fullname}
            leftIcon={'TextFields'}
            isTouchDisabled
          />
          <SettingItem
            title={'settings:title_gender'}
            // @ts-ignore
            subtitle={i18next.t(genders[gender])}
            leftIcon={'UserSquare'}
            isTouchDisabled
          />
          <SettingItem
            title={'settings:title_birthday'}
            subtitle={formatDate(birthday, 'MMM Do, YYYY')}
            leftIcon={'Calender'}
            isTouchDisabled
          />
          <SettingItem
            title={'settings:title_speaking_languages'}
            subtitle={userLanguages}
            leftIcon={'CommentsAlt'}
            isTouchDisabled
          />
          <SettingItem
            title={'settings:title_relationship_status'}
            // @ts-ignore
            subtitle={i18next.t(relationshipStatus[relationship_status])}
            leftIcon={'Heart'}
            isTouchDisabled
          />
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper testID="UserProfile" style={styles.container} isFullView>
      <Header title={i18next.t('settings:title_user_profile')} />
      <ScrollView>
        {renderAvatar()}
        {renderCover()}
        {renderBasicInfo()}
      </ScrollView>
    </ScreenWrapper>
  );
};

export default UserProfile;

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

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
    cover: {
      width: scaleSize(375),
      height: scaleSize(210),
      maxHeight: 250,
      maxWidth: 565,
    },
    basicInfoList: {
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
