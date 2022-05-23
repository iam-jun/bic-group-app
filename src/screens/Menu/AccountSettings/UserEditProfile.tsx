import i18next from 'i18next';
import React, {useEffect, useState} from 'react';
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
import Button from '~/beinComponents/Button';

import {IUploadType, uploadTypes} from '~/configs/resourceConfig';
import genders from '~/constants/genders';
import relationshipStatus from '~/constants/relationshipStatus';
import speakingLanguages from '~/constants/speakingLanguages';
import {IFilePicked} from '~/interfaces/common';
import images from '~/resources/images';
import mainStack from '~/router/navigator/MainStack/stack';
import SettingItem from '~/screens/Menu/AccountSettings/EditBasicInfo/fragments/SettingItem';
import {
  scaleCoverHeight,
  scaleSize,
  userProfileImageCropRatio,
} from '~/theme/dimension';
import {useUserIdAuth} from '~/hooks/auth';
import {useRootNavigation} from '~/hooks/navigation';

import {ITheme} from '~/theme/interfaces';
import {formatDate} from '~/utils/formatData';
import menuActions from '../redux/actions';
import {useKeySelector} from '~/hooks/selector';
import menuKeySelector from '../redux/keySelector';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import {IUserWorkExperience} from '~/interfaces/IAuth';
import Icon from '~/beinComponents/Icon';
import Avatar from '~/beinComponents/Avatar';
import homeActions from '~/screens/Home/redux/actions';
import {checkPermission} from '~/utils/permission';

const UserEditProfile = (props: any) => {
  const {userId} = props?.route?.params || {};

  const [coverHeight, setCoverHeight] = useState<number>(210);
  const [userData, setUserData] = useState<any>({});
  const [showEditButton, setShowEditButton] = useState<boolean>(false);

  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = themeStyles(theme, coverHeight);
  const dispatch = useDispatch();

  const myProfile: any = useKeySelector(menuKeySelector.myProfile);
  const {username: currentUsername, id} = myProfile || {};
  const {rootNavigation} = useRootNavigation();

  const {
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
    country,
    city,
    description,
  } = userData || {};

  const userProfileData = useKeySelector(menuKeySelector.userProfile);

  const loadingAvatar = useKeySelector(menuKeySelector.loadingAvatar);
  const loadingCover = useKeySelector(menuKeySelector.loadingCover);
  const myWorkExperience = useKeySelector(menuKeySelector.myWorkExperience);
  const userWorkExperience = useKeySelector(menuKeySelector.userWorkExperience);

  const currentUserId = useUserIdAuth();

  const getUserProfile = () => {
    dispatch(menuActions.clearUserProfile());
    if (!!userId) dispatch(menuActions.getUserProfile({userId}));
  };

  useEffect(() => {
    setShowEditButton(
      userId?.toString?.() === currentUserId?.toString?.() ||
        userId?.toString?.() === currentUsername?.toString?.(),
    );
    if (
      userId?.toString?.() === currentUserId?.toString?.() ||
      userId?.toString?.() === currentUsername?.toString?.()
    ) {
      dispatch(homeActions.getHomePosts({isRefresh: true}));
      setUserData(myProfile);
    } else {
      setUserData(userProfileData);
    }
    dispatch(menuActions.getUserWorkExperience(userId));
  }, [myProfile, userProfileData, userId]);

  useEffect(() => {
    getUserProfile();
  }, []);

  useEffect(() => {
    dispatch(menuActions.getMyWorkExperience());
  }, []);

  const userLanguageList = language?.map(
    // @ts-ignore
    (code: string) => speakingLanguages[code].name,
  );
  const userLanguages = userLanguageList?.join(', ');

  const goToEditInfo = () => rootNavigation.navigate(mainStack.editBasicInfo);

  const goToEditContact = () => rootNavigation.navigate(mainStack.editContact);

  const goToAddWork = () => {
    dispatch(menuActions.setSelectedWorkItem(null));
    rootNavigation.navigate(mainStack.addWork);
  };

  const selectWorkItem = (item: IUserWorkExperience) => {
    dispatch(menuActions.setSelectedWorkItem(item));
    rootNavigation.navigate(mainStack.addWork);
  };

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
  const _openImagePicker = async (
    fieldName: 'avatar' | 'background_img_url',
    uploadType: IUploadType,
  ) => {
    checkPermission('photo', dispatch, canOpenPicker => {
      if (canOpenPicker) {
        ImagePicker.openPickerSingle({
          ...userProfileImageCropRatio[fieldName],
          cropping: true,
          mediaType: 'photo',
        }).then(file => {
          uploadFile(file, fieldName, uploadType);
        });
      }
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

  const goToEditDescription = () => {
    rootNavigation.navigate(mainStack.editDescription);
  };

  const renderAvatar = () => {
    if (!showEditButton) {
      return null;
    }
    return (
      <View>
        <View style={styles.headerItem}>
          <Text.H5 color={colors.iconTint} variant="body" useI18n>
            settings:title_avatar
          </Text.H5>
          <ButtonWrapper onPress={onEditAvatar} disabled={loadingAvatar}>
            <Text.H6
              testID="user_edit_profile.avatar.edit"
              color={!loadingAvatar ? colors.textPrimary : colors.textDisabled}
              style={styles.editBtn}
              useI18n>
              settings:title_edit
            </Text.H6>
          </ButtonWrapper>
        </View>
        <View style={styles.imageButton}>
          {!loadingAvatar ? (
            <Avatar.UltraSuperLarge
              style={styles.avatar}
              source={avatar || images.img_user_avatar_default}
              isRounded={true}
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
    if (!showEditButton) {
      return null;
    }
    return (
      <View>
        <View style={styles.headerItem}>
          <Text.H5 color={colors.iconTint} variant="body" useI18n>
            settings:title_cover
          </Text.H5>
          <ButtonWrapper onPress={onEditCover} disabled={loadingCover}>
            <Text.H6
              testID="user_edit_profile.cover.edit"
              color={!loadingCover ? colors.textPrimary : colors.textDisabled}
              style={styles.editBtn}
              useI18n>
              settings:title_edit
            </Text.H6>
          </ButtonWrapper>
        </View>
        <View
          style={{paddingHorizontal: theme.spacing.padding.large}}
          onLayout={onCoverLayout}
          testID="user_edit_profile.cover_image">
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
      </View>
    );
  };

  const renderDescription = () => {
    if (!showEditButton) {
      return null;
    }
    return (
      <View style={{paddingTop: theme.spacing.padding.base}}>
        <View style={styles.headerItem}>
          <Text.H5 color={colors.iconTint} variant="body" useI18n>
            settings:text_description
          </Text.H5>
          <ButtonWrapper onPress={goToEditDescription}>
            <Text.H6
              testID="user_edit_profile.description.edit"
              color={colors.textPrimary}
              style={styles.editBtn}
              useI18n>
              settings:title_edit
            </Text.H6>
          </ButtonWrapper>
        </View>
        <Text.BodyS
          testID="user_edit_profile.description.text"
          style={styles.descriptionText}>
          {description || i18next.t('common:text_not_set')}
        </Text.BodyS>
        <Divider style={styles.divider} />
      </View>
    );
  };

  const renderBasicInfo = () => {
    return (
      <View>
        <View style={styles.headerItem}>
          <Text.H5 color={colors.iconTint} variant="body" useI18n>
            settings:title_basic_info
          </Text.H5>
          {showEditButton ? (
            <ButtonWrapper style={styles.editBtn} onPress={goToEditInfo}>
              <Text.H6
                testID="user_edit_profile.basic_info.edit"
                color={colors.textPrimary}
                useI18n>
                settings:title_edit
              </Text.H6>
            </ButtonWrapper>
          ) : null}
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
              formatDate(birthday, 'MMMM DD, YYYY') ||
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
        </View>
      </View>
    );
  };

  const renderContact = () => {
    return (
      <View>
        <Divider style={styles.divider} />
        <View style={styles.headerItem}>
          <Text.H5 color={colors.iconTint} variant="body" useI18n>
            settings:title_contact
          </Text.H5>
          {showEditButton ? (
            <ButtonWrapper onPress={goToEditContact}>
              <Text.H6
                testID="user_edit_profile.contact.edit"
                color={colors.textPrimary}
                style={styles.editBtn}
                useI18n>
                settings:title_edit
              </Text.H6>
            </ButtonWrapper>
          ) : null}
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
            title={'settings:title_location'}
            subtitle={
              city && country
                ? `${city}, ${country}`
                : i18next.t('common:text_not_set')
            }
            leftIcon={'LocationPoint'}
            isTouchDisabled
          />
        </View>
      </View>
    );
  };

  const renderWorkItem = ({item}: {item: IUserWorkExperience}) => {
    return (
      <PrimaryItem
        testID={'user_edit_profile.work.item'}
        height={null}
        leftIcon={'iconSuitcase'}
        leftIconProps={{
          icon: 'iconSuitcase',
          size: 24,
        }}
        RightComponent={
          showEditButton ? <Icon icon={'EditAlt'} size={20} /> : null
        }
        ContentComponent={
          <View>
            <Text.ButtonBase>{`${item?.titlePosition} ${i18next.t(
              'common:text_at',
            )} ${item?.company}`}</Text.ButtonBase>
            {item?.startDate && (
              <Text>
                {`${formatDate(item.startDate, 'MMM Do, YYYY')} ${
                  item?.currentlyWorkHere
                    ? `${i18next.t('common:text_to')} ${i18next.t(
                        'common:text_present',
                      )}`
                    : item?.endDate
                    ? `${i18next.t('common:text_to')} ${formatDate(
                        item.endDate,
                        'MMM Do, YYYY',
                      )}`
                    : ''
                }`}
              </Text>
            )}
            {!!item?.location && (
              <Text.Subtitle color={colors.textSecondary}>
                {item.location}
              </Text.Subtitle>
            )}
            {!!item?.description && (
              <Text.Subtitle numberOfLines={3} color={colors.textSecondary}>
                {item.description}
              </Text.Subtitle>
            )}
          </View>
        }
        onPress={() => {
          showEditButton && selectWorkItem(item);
        }}
      />
    );
  };

  const renderWorkExperience = () => {
    if (!showEditButton && userWorkExperience?.length > 0) {
      return (
        <View style={styles.paddingBottom}>
          <Divider style={styles.divider} />
          <View style={styles.headerItem}>
            <Text.H5 color={colors.iconTint} variant="body" useI18n>
              settings:text_work
            </Text.H5>
          </View>
          <View style={styles.infoItem}>
            {userWorkExperience.map((item: IUserWorkExperience) => (
              <View key={item?.id + item?.company}>
                {renderWorkItem({item})}
              </View>
            ))}
          </View>
        </View>
      );
    }
    return showEditButton ? (
      <View>
        <Divider style={styles.divider} />
        <View style={styles.headerItem}>
          <Text.H5 color={colors.iconTint} variant="body" useI18n>
            settings:text_work
          </Text.H5>
        </View>
        <View style={styles.infoItem}>
          {(myWorkExperience || [])?.map((item: IUserWorkExperience) => (
            <View key={item?.id + item?.company + item?.titlePosition}>
              {renderWorkItem({item})}
            </View>
          ))}
        </View>
        <Button.Secondary
          color={colors.primary1}
          textColor={colors.primary6}
          onPress={goToAddWork}
          style={styles.buttonAddWork}
          testID="user_edit_profile.work.add_work">
          {i18next.t('settings:text_add_work')}
        </Button.Secondary>
      </View>
    ) : null;
  };

  return (
    <ScreenWrapper testID="UserEditProfile" style={styles.container} isFullView>
      <Header
        title={i18next.t('settings:title_about')}
        hideBackOnLaptop={rootNavigation.canGoBack ? false : true}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderAvatar()}
        {renderCover()}
        {renderDescription()}
        {renderBasicInfo()}
        {renderContact()}
        {renderWorkExperience()}
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
    headerItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingRight: spacing.padding.base,
      paddingVertical: spacing.padding.small,
      paddingLeft: spacing.padding.large,
      alignItems: 'center',
    },
    editBtn: {padding: spacing.padding.small},
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
      borderRadius: spacing.borderRadius.small,
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
    buttonAddWork: {
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.base,
    },
    descriptionText: {
      marginHorizontal: spacing.margin.large,
      marginTop: spacing.margin.small,
    },
    paddingBottom: {
      paddingBottom: spacing.margin.extraLarge,
    },
  });
};
