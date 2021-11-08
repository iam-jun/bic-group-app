import i18next from 'i18next';
import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import BottomSheet from '~/beinComponents/BottomSheet';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Header from '~/beinComponents/Header';
import Icon from '~/beinComponents/Icon';
import Image from '~/beinComponents/Image';
import ImagePicker from '~/beinComponents/ImagePicker';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';

import privacyTypes from '~/constants/privacyTypes';
import useGroups from '~/hooks/groups';
import {useRootNavigation} from '~/hooks/navigation';
import {IFilePicked} from '~/interfaces/common';
import images from '~/resources/images';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import groupsActions from '~/screens/Groups/redux/actions';
import * as modalActions from '~/store/modal/actions';
import {
  groupProfileImageCropRatio,
  scaleSize,
  scaleCoverHeight,
} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {titleCase} from '~/utils/common';
import GroupSectionItem from '../components/GroupSectionItem';
import {IUploadType, uploadTypes} from '~/configs/resourceConfig';

const GeneralInformation = (props: any) => {
  const params = props.route.params;
  const {groupId: id} = params || {};

  const [coverHeight, setCoverHeight] = useState<number>(210);

  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = themeStyles(theme, coverHeight);
  const dispatch = useDispatch();
  const {groupDetail, loadingAvatar, loadingCover} = useGroups();
  const {name, icon, background_img_url, description, privacy} =
    groupDetail.group;

  const baseSheetRef: any = useRef();
  const {rootNavigation} = useRootNavigation();

  useEffect(() => {
    // in case for refreshing page on web
    Platform.OS === 'web' && dispatch(groupsActions.getGroupDetail(id));
  }, [id]);

  const helpMessage = () => {
    baseSheetRef.current?.close();
    dispatch(
      modalActions.showAlert({
        title: i18next.t('settings:text_info'),
        content: i18next.t('settings:text_help_center'),
        onConfirm: () => dispatch(modalActions.hideAlert()),
        confirmLabel: i18next.t('settings:text_got_it'),
      }),
    );
  };

  const editGroupPrivacy = (e: any) =>
    baseSheetRef?.current?.open?.(e?.pageX, e?.pageY);

  const onPrivacyMenuPress = (item: any) => {
    baseSheetRef.current?.close();
    dispatch(groupsActions.editGroupDetail({id, privacy: item.type}));
  };

  const editGroupDescripton = () =>
    rootNavigation.navigate(groupStack.editGroupDescription, {groupId: id});

  const uploadFile = (
    file: IFilePicked,
    fieldName: 'icon' | 'background_img_url',
    uploadType: IUploadType,
  ) => {
    dispatch(
      groupsActions.uploadImage({
        id,
        file,
        fieldName,
        uploadType,
      }),
    );
  };

  // fieldName: field name in group profile to be edited
  // 'icon' for avatar and 'background_img_url' for cover
  const _openImagePicker = (
    fieldName: 'icon' | 'background_img_url',
    uploadType: IUploadType,
  ) => {
    ImagePicker.openPickerSingle({
      ...groupProfileImageCropRatio[fieldName],
      cropping: true,
      mediaType: 'photo',
    }).then(file => {
      uploadFile(file, fieldName, uploadType);
    });
  };

  const onEditAvatar = () => _openImagePicker('icon', uploadTypes.groupAvatar);

  const onEditCover = () =>
    _openImagePicker('background_img_url', uploadTypes.groupCover);

  const onCoverLayout = (e: any) => {
    if (!e?.nativeEvent?.layout?.width) return;
    const coverWidth = e.nativeEvent.layout.width;
    const coverHeight = scaleCoverHeight(coverWidth);
    setCoverHeight(coverHeight);
  };

  const renderBottomSheet = ({item}: {item: any}) => {
    return (
      <TouchableOpacity onPress={() => onPrivacyMenuPress(item)}>
        <PrimaryItem
          title={i18next.t(item.title)}
          subTitle={
            <Text>
              {`${i18next.t(item.subtitle)} `}
              <Text onPress={helpMessage} color={colors.link} useI18n>
                settings:text_learn_more
              </Text>
            </Text>
          }
          LeftComponent={
            <Icon style={styles.bottomSheetLeftIcon} icon={item.icon} />
          }
          RightComponent={
            privacy === item.type ? (
              <Icon icon={'Check'} size={24} tintColor={colors.primary7} />
            ) : undefined
          }
        />
      </TouchableOpacity>
    );
  };

  const renderAvatarImage = () => {
    return (
      <View>
        <View style={styles.avatarHeader}>
          <Text.H5 color={colors.iconTint} useI18n>
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
              source={icon || images.img_user_avatar_default}
            />
          ) : (
            <View style={[styles.avatar, styles.imageLoading]}>
              <ActivityIndicator />
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderCoverImage = () => {
    return (
      <View>
        <View style={styles.coverHeader}>
          <Text.H5 color={colors.iconTint} useI18n>
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
      </View>
    );
  };

  const renderGroupInfo = () => {
    return (
      <View style={styles.basicInfoList}>
        <GroupSectionItem
          title={'settings:title_group_name'}
          subtitle={name}
          rightIcon={'AngleRightB'}
        />

        <GroupSectionItem
          title={'settings:title_group_description'}
          subtitle={description}
          onPress={editGroupDescripton}
          rightIcon={'AngleRightB'}
        />

        <GroupSectionItem
          title={'settings:title_privacy'}
          subtitle={titleCase(privacy) || ''}
          rightIcon={'EditAlt'}
          onPress={e => editGroupPrivacy(e)}
        />
      </View>
    );
  };

  return (
    <ScreenWrapper
      testID="GeneralInformation"
      style={styles.container}
      isFullView>
      <Header title={i18next.t('settings:title_general_information')} />
      <ScrollView>
        {renderAvatarImage()}
        {renderCoverImage()}
        {renderGroupInfo()}

        <BottomSheet
          modalizeRef={baseSheetRef}
          ContentComponent={
            <View style={styles.contentBottomSheet}>
              <Text.H5
                color={colors.iconTint}
                style={styles.privacyTypeText}
                useI18n>
                settings:title_privacy_type
              </Text.H5>
              <ListView
                type="primary"
                data={privacyTypes}
                renderItem={renderBottomSheet}
                onItemPress={onPrivacyMenuPress}
              />
            </View>
          }
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default GeneralInformation;

const themeStyles = (theme: ITheme, coverHeight: number) => {
  const {spacing, colors} = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
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
    basicInfoList: {
      marginHorizontal: spacing.margin.tiny,
    },
    imageButton: {
      alignItems: 'center',
    },
    contentBottomSheet: {
      marginHorizontal: spacing.margin.base,
      marginTop: spacing.margin.large,
    },
    privacyTypeText: {
      marginLeft: spacing.margin.base,
      marginBottom: spacing.margin.small,
      fontSize: 18,
    },
    bottomSheetLeftIcon: {
      marginRight: spacing.margin.large,
    },
  });
};
