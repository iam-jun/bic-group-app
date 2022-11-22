import { ScrollView, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import i18next from 'i18next';
import { useDispatch } from 'react-redux';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import Text from '~/baseComponents/Text';
import { spacing } from '~/theme';
import PrivacyItem from './components/PrivacyItem';
import { CommunityPrivacyType, GroupPrivacyType } from '~/constants/privacyTypes';
import useCommunityController from '~/screens/communities/store';
import groupsActions from '~/storeRedux/groups/actions';
import { useRootNavigation } from '~/hooks/navigation';
import Icon from '~/baseComponents/Icon';
import { CheckBox } from '~/baseComponents';

const EditPrivacy = (props: any) => {
  const {
    type = 'group', id = '', privacy = '', isJoinApproval,
  } = props?.route?.params || {};

  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const { colors } = theme;
  const { rootNavigation } = useRootNavigation();

  const [selectedPrivacy, setSelectedPrivacy] = useState(privacy);
  const isGroupScope = type === 'group';
  const privacyType = isGroupScope ? GroupPrivacyType : CommunityPrivacyType;
  const controller = useCommunityController((state) => state.actions);

  const shouldSelectSecretPrivacy = selectedPrivacy === privacyType.SECRET;
  const shouldSelectPrivatePrivacy = selectedPrivacy === privacyType.PRIVATE;

  const [joinSettingState, setJoinSettingState] = useState(isJoinApproval);
  const shouldDisableSaveBtn = selectedPrivacy === privacy && joinSettingState === isJoinApproval;

  const onNavigateBack = () => rootNavigation.goBack();

  const onPressSave = () => {
    const data = { id, privacy: selectedPrivacy };
    const editFieldName = i18next.t('common:text_privacy');

    if (type === 'group') {
      if (shouldSelectPrivatePrivacy) {
        dispatch(groupsActions.updateGroupJoinSetting({ groupId: id, isJoinApproval: joinSettingState }));
      }
      dispatch(groupsActions.editGroupDetail({ data, editFieldName, callback: onNavigateBack }));
    } else {
      if (shouldSelectPrivatePrivacy) {
        controller.updateCommunityJoinSetting(id, joinSettingState);
      }
      controller.editCommunityDetail(data, editFieldName, onNavigateBack);
    }
  };

  const onSelectPrivacy = (value: string) => {
    setSelectedPrivacy(value);

    // Auto turn ON checkbox when selecting Private privacy
    if (value === privacyType.PRIVATE) {
      setJoinSettingState(true);
    }
  };

  const onPressPrivateCheckbox = (isChecked?: boolean) => {
    setJoinSettingState(isChecked);
  };

  const renderPrivacyNote = () => (
    <View style={styles.noteView}>
      <Text.BodySMedium color={colors.neutral40} useI18n>
        settings:title_privacy_note
      </Text.BodySMedium>
    </View>
  );

  const renderPrivacyList = () => (
    <ScrollView style={styles.privacyContainer} showsVerticalScrollIndicator={false}>
      <PrivacyItem
        value={privacyType.PUBLIC}
        icon="iconPublic"
        title="settings:title_public"
        subtitle={`settings:title_public_subtitle_${type}`}
        selectedPrivacy={selectedPrivacy}
        onPress={onSelectPrivacy}
      />

      <PrivacyItem
        value={privacyType.PRIVATE}
        icon="iconPrivate"
        title="settings:title_private"
        subtitle={`settings:title_private_subtitle_${type}`}
        selectedPrivacy={selectedPrivacy}
        onPress={onSelectPrivacy}
      />
      {shouldSelectPrivatePrivacy && (
        <View style={styles.privacyBannerView}>
          <CheckBox size="small" isChecked={joinSettingState} onPress={onPressPrivateCheckbox} />
          <Text.BodyS style={styles.bannerText} color={colors.neutral40} useI18n>
            {`settings:text_private_${type}_banner_message`}
          </Text.BodyS>
        </View>
      )}

      <PrivacyItem
        value={privacyType.SECRET}
        icon="iconSecret"
        title="settings:title_secret"
        subtitle={`settings:title_secret_subtitle_${type}`}
        selectedPrivacy={selectedPrivacy}
        onPress={onSelectPrivacy}
      />
      {shouldSelectSecretPrivacy && (
        <View style={styles.privacyBannerView}>
          <Icon icon="CircleInfo" tintColor={colors.neutral20} size={18} />
          <Text.BodyS style={styles.bannerText} color={colors.neutral40} useI18n>
            {`settings:text_secret_${type}_banner_message`}
          </Text.BodyS>
        </View>
      )}

      {isGroupScope && (
        <PrivacyItem
          value={GroupPrivacyType.OPEN}
          icon="iconOpen"
          title="settings:title_open"
          subtitle={`settings:title_open_subtitle_${type}`}
          selectedPrivacy={selectedPrivacy}
          onPress={onSelectPrivacy}
        />
      )}
    </ScrollView>
  );

  return (
    <ScreenWrapper
      testID="EditPrivacy"
      backgroundColor={colors.gray5}
      isFullView
    >
      <Header
        title="settings:title_edit_privacy"
        titleTextProps={{ useI18n: true }}
        buttonText="common:btn_save"
        buttonProps={{ useI18n: true, disabled: shouldDisableSaveBtn }}
        onPressButton={onPressSave}
      />
      {renderPrivacyNote()}
      {renderPrivacyList()}
    </ScreenWrapper>
  );
};

export default EditPrivacy;

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    noteView: {
      backgroundColor: colors.gray1,
      marginVertical: spacing.margin.large,
      paddingHorizontal: spacing.margin.large,
      paddingVertical: spacing.margin.base,
    },
    privacyContainer: {
      flex: 1,
      backgroundColor: colors.white,
      paddingVertical: spacing.margin.tiny,
    },
    privacyBannerView: {
      flexDirection: 'row',
      backgroundColor: colors.gray1,
      marginBottom: spacing.margin.large,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.base,
    },
    bannerText: {
      flex: 1,
      marginHorizontal: spacing.margin.small,
    },
  });
};
