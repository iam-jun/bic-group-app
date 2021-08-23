import React, {useState, useRef} from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import i18next from 'i18next';
import ImagePicker from 'react-native-image-crop-picker';

import {ITheme} from '~/theme/interfaces';
import {scaleSize} from '~/theme/dimension';
import images from '~/resources/images';
import useGroups from '~/hooks/groups';
import {titleCase} from '~/utils/common';
import privacyTypes from '~/constants/privacyTypes';
import groupsActions from '~/screens/Groups/redux/actions';
import {useRootNavigation} from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import * as modalActions from '~/store/modal/actions';
import GroupSectionItem from '../components/GroupSectionItem';
import {validateFile} from '~/utils/validation';
import {IFileResponse} from '~/interfaces/common';
import dimension from '~/theme/dimension';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Text from '~/beinComponents/Text';
import Image from '~/beinComponents/Image';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Icon from '~/beinComponents/Icon';
import BottomSheet from '~/beinComponents/BottomSheet';
import ListView from '~/beinComponents/list/ListView';

const GeneralInformation = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();
  const {groupDetail, isPrivacyModalOpen} = useGroups();
  const {id, name, icon, background_img_url, description, privacy} =
    groupDetail.group;

  const baseSheetRef: any = useRef();
  const {rootNavigation} = useRootNavigation();

  const [error, setError] = useState<string | null>(null);

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

  const onPrivacyModalClose = () =>
    dispatch(groupsActions.setPrivacyModalOpen(false));

  const editGroupPrivacy = () =>
    dispatch(groupsActions.setPrivacyModalOpen(true));

  const onPrivacyMenuPress = (item: any) => {
    baseSheetRef.current?.close();
    dispatch(groupsActions.editGroupDetail({id, privacy: item.type}));
  };

  const editGroupDescripton = () =>
    rootNavigation.navigate(groupStack.editGroupDescription);

  const uploadFile = (file: IFileResponse, fieldName: string) => {
    dispatch(
      groupsActions.uploadImage({
        id,
        image: file,
        fieldName,
      }),
    );
  };
  const _openImagePicker = (fieldName: 'icon' | 'background_img_url') => {
    ImagePicker.openPicker({
      width:
        fieldName === 'background_img_url' ? dimension.deviceWidth : undefined,
      height:
        fieldName === 'background_img_url'
          ? (dimension.deviceWidth / 16) * 9
          : undefined,
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
      uploadFile(file, fieldName);
    });
  };

  const onEditAvatar = () => _openImagePicker('icon');

  const onEditCover = () => _openImagePicker('background_img_url');

  const renderBottomSheet = ({item}: {item: any}) => {
    return (
      <TouchableOpacity onPress={() => onPrivacyMenuPress(item)}>
        <PrimaryItem
          title={i18next.t(item.title)}
          subTitle={
            <Text>
              {`${i18next.t(item.subtitle)} `}
              <Text onPress={helpMessage} color={theme.colors.link} useI18n>
                settings:text_learn_more
              </Text>
            </Text>
          }
          LeftComponent={
            <Icon style={styles.bottomSheetLeftIcon} icon={item.icon} />
          }
          RightComponent={
            privacy === item.type ? (
              <Icon
                icon={'Check'}
                size={24}
                tintColor={theme.colors.primary7}
              />
            ) : undefined
          }
        />
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper
      testID="GeneralInformation"
      style={styles.container}
      isFullView>
      <Header title={i18next.t('settings:title_general_information')} />
      <ScrollView>
        {/* --- AVATAR --- */}
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
            source={icon || images.img_user_avatar_default}
          />
        </ButtonWrapper>

        {/* --- COVER --- */}
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

        {/* --- GROUP INFO --- */}
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
            subtitle={titleCase(privacy)}
            rightIcon={'EditAlt'}
            onPress={editGroupPrivacy}
          />
        </View>

        <BottomSheet
          isOpen={isPrivacyModalOpen}
          onClose={onPrivacyModalClose}
          modalizeRef={baseSheetRef}
          ContentComponent={
            <View style={styles.contentBottomSheet}>
              <Text.H5
                color={theme.colors.iconTint}
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

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;

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
    cover: {
      width: scaleSize(375),
      height: scaleSize(210),
      maxHeight: 250,
      maxWidth: 525,
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
