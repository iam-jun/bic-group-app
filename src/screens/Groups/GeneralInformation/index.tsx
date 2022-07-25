import i18next from 'i18next';
import React, { useEffect, useRef } from 'react';
import {
  ScrollView, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import BottomSheet from '~/beinComponents/BottomSheet';
import Header from '~/beinComponents/Header';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import { uploadTypes } from '~/configs/resourceConfig';
import privacyTypes, {
  communityPrivacyListDetail,
  groupPrivacy,
} from '~/constants/privacyTypes';
import { useKeySelector } from '~/hooks/selector';
import groupsActions from '~/screens/Groups/redux/actions';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import * as modalActions from '~/store/modal/actions';

import AvatarImage from './components/AvatarImage';
import PrivacyItem from './components/PrivacyItem';
import CoverImage from './components/CoverImage';
import InfoView from './components/InfoView';
import { alertAction, _openImagePicker } from './helper';
import spacing from '~/theme/spacing';

const GeneralInformation = (props: any) => {
  const { params } = props.route;
  const { id, type = 'group' } = params || {};

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const dispatch = useDispatch();

  const baseSheetRef: any = useRef();
  let avatar: string;
  let backgroundUrl: string;
  let canEditInfo: boolean;
  let organizationName: string;
  let organizationDescription: string;
  let organizationPrivacy: any;
  let canEditPrivacy: boolean;
  let total: number;
  if (type === 'group') {
    canEditInfo = useKeySelector(groupsKeySelector.groupDetail.can_edit_info) || {};
    canEditPrivacy = useKeySelector(groupsKeySelector.groupDetail.can_edit_privacy) || {};
    const groupDetail = useKeySelector(groupsKeySelector.groupDetail.group) || {};
    avatar = groupDetail?.icon || '';
    backgroundUrl = groupDetail?.background_img_url || '';
    organizationName = groupDetail?.name || '';
    organizationDescription = groupDetail?.description || '';
    organizationPrivacy = groupDetail?.privacy || '';
    total = useKeySelector(groupsKeySelector.groupMemberRequests)?.total || 0;
  } else {
    const communityDetail = useKeySelector(groupsKeySelector.communityDetail) || {};
    avatar = communityDetail?.icon || '';
    backgroundUrl = communityDetail?.background_img_url || '';
    canEditInfo = communityDetail?.can_edit_info || false;
    organizationName = communityDetail?.name || '';
    organizationDescription = communityDetail?.description || '';
    organizationPrivacy = communityDetail?.privacy || '';
    canEditPrivacy = communityDetail?.can_edit_privacy || false;
    total = useKeySelector(groupsKeySelector.communityMemberRequests)?.total || 0;
  }

  useEffect(() => {
    if (type === 'group') {
      dispatch(groupsActions.getGroupDetail(id));
    } else {
      dispatch(groupsActions.getCommunityDetail({ communityId: id }));
    }
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

  const openGroupPrivacyModal = () => baseSheetRef?.current?.open?.();

  const editPrivacy = (item: any) => {
    if (type === 'group') {
      dispatch(
        groupsActions.editGroupDetail({
          data: { id, privacy: item.type },
          editFieldName: i18next.t('common:text_privacy'),
        }),
      );
    } else {
      dispatch(
        groupsActions.editCommunityDetail({
          data: { id, privacy: item.type },
          editFieldName: i18next.t('common:text_privacy'),
        }),
      );
    }
  };

  const approveAllGroupMemberRequests = () => {
    if (type === 'group') {
      dispatch(groupsActions.approveAllGroupMemberRequests({ groupId: id }));
    } else {
      dispatch(
        groupsActions.approveAllCommunityMemberRequests({ communityId: id }),
      );
    }
    editPrivacy({ type: groupPrivacy.public });
  };

  const declineAllGroupMemberRequests = () => {
    if (type === 'group') {
      dispatch(groupsActions.declineAllGroupMemberRequests({ groupId: id }));
    } else {
      dispatch(
        groupsActions.declineAllCommunityMemberRequests({ communityId: id }),
      );
    }
    editPrivacy({ type: groupPrivacy.secret });
  };

  const onPrivacyMenuPress = (item: any) => {
    baseSheetRef.current?.close();

    if (organizationPrivacy === groupPrivacy.private && total > 0) {
      if (item.type === groupPrivacy.public) {
        alertAction(
          dispatch,
          theme,
          i18next.t('groups:update_privacy_modal:title'),
          i18next.t('groups:update_privacy_modal:content:approve'),
          approveAllGroupMemberRequests,
        );
      }

      if (item.type === groupPrivacy.secret) {
        alertAction(
          dispatch,
          theme,
          i18next.t('groups:update_privacy_modal:title'),
          i18next.t('groups:update_privacy_modal:content:decline'),
          declineAllGroupMemberRequests,
        );
      }
    } else {
      editPrivacy(item);
    }
  };

  const onEditAvatar = () => _openImagePicker(dispatch, id, 'icon', uploadTypes.groupAvatar, type);

  const onEditCover = () => _openImagePicker(
    dispatch,
    id,
    'background_img_url',
    uploadTypes.groupCover,
    type,
  );

  const renderPrivacyItem = ({ item }: {item: any}) => (
    <TouchableOpacity
      testID={`general_information.privacy_item.${item.type}`}
      onPress={() => onPrivacyMenuPress(item)}
    >
      <PrivacyItem item={item} onPressHelpMessage={helpMessage} />
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper
      testID="general_information"
      style={styles.container}
      isFullView
    >
      <Header title={i18next.t('settings:title_general_information')} />
      <ScrollView>
        <AvatarImage
          avatar={avatar}
          testID="general_information.avatar"
          onEditAvatar={onEditAvatar}
          canEditInfo={canEditInfo}
          type={type}
        />
        <CoverImage
          backgroundUrl={backgroundUrl}
          testID="general_information.cover"
          onEditCover={onEditCover}
          canEditInfo={canEditInfo}
          type={type}
        />
        <InfoView
          id={id}
          onPressPrivacy={openGroupPrivacyModal}
          type={type}
          canEditInfo={canEditInfo}
          canEditPrivacy={canEditPrivacy}
          name={organizationName}
          privacy={organizationPrivacy}
          description={organizationDescription}
        />
        <BottomSheet
          modalizeRef={baseSheetRef}
          ContentComponent={(
            <View style={styles.contentBottomSheet}>
              <Text.H5
                color={colors.neutral80}
                style={styles.privacyTypeText}
                useI18n
              >
                settings:title_privacy_type
              </Text.H5>
              <ListView
                data={
                  type === 'group' ? privacyTypes : communityPrivacyListDetail
                }
                renderItem={renderPrivacyItem}
              />
            </View>
          )}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default GeneralInformation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
