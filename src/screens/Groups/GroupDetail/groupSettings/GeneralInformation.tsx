import React, {useEffect} from 'react';
import {StyleSheet, View, ScrollView, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {useBaseHook} from '~/hooks';
import {ITheme} from '~/theme/interfaces';
import {scaleSize} from '~/theme/dimension';
import * as modalActions from '~/store/modal/actions';
import menuActions from '~/screens/Menu/redux/actions';
import {IconType} from '~/resources/icons';
import images from '~/resources/images';
import useGroups from '~/hooks/groups';
import {titleCase} from '~/utils/common';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import Text from '~/beinComponents/Text';
import Image from '~/beinComponents/Image';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Icon from '~/beinComponents/Icon';

const GeneralInformation = () => {
  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const groupData = useGroups();
  const {groupDetail} = groupData || {};
  const {name, icon, background_img_url, description, privacy} =
    groupDetail?.group || {};

  const renderItem = (
    title: string,
    subtitle: string,
    rightIcon: IconType,
    privacyIcon?: IconType,
  ) => {
    return (
      <TouchableOpacity onPress={popupMessage}>
        <PrimaryItem
          title={t(title)}
          subTitle={subtitle}
          RightComponent={
            <>
              {privacyIcon && <Icon icon={privacyIcon} />}
              <Icon icon={rightIcon} style={styles.rightEditIcon} />
            </>
          }
        />
      </TouchableOpacity>
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
    <ScreenWrapper
      testID="GeneralInformation"
      style={styles.container}
      isFullView>
      <Header title={t('settings:title_general_information')} />
      <ScrollView>
        {/* --- AVATAR --- */}
        <View style={styles.avatarHeader}>
          <Text.H5 color={theme.colors.iconTint} useI18n>
            settings:title_avatar
          </Text.H5>
          <ButtonWrapper onPress={popupMessage}>
            <Text.H6 color={theme.colors.primary7} useI18n>
              settings:title_edit
            </Text.H6>
          </ButtonWrapper>
        </View>
        <ButtonWrapper onPress={popupMessage} style={styles.imageButton}>
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
          <ButtonWrapper onPress={popupMessage}>
            <Text.H6 color={theme.colors.primary7} useI18n>
              settings:title_edit
            </Text.H6>
          </ButtonWrapper>
        </View>
        <ButtonWrapper onPress={popupMessage}>
          <Image
            resizeMode="cover"
            style={styles.cover}
            source={background_img_url || images.img_cover_default}
          />
        </ButtonWrapper>

        {/* --- GROUP INFO --- */}
        <View style={styles.basicInfoList}>
          {renderItem('settings:title_group_name', name, 'AngleRightB')}
          {renderItem(
            'settings:title_group_description',
            description,
            'AngleRightB',
          )}
          {renderItem(
            'settings:title_privacy',
            titleCase(privacy),
            'EditAlt',
            'Globe',
          )}
        </View>
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
      maxHeight: 125,
      maxWidth: 125,
      borderRadius: 8,
    },
    cover: {
      width: scaleSize(375),
      height: scaleSize(192),
      maxHeight: 250,
      maxWidth: 525,
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
