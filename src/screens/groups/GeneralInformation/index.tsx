import i18next from 'i18next';
import React, { useEffect, useRef } from 'react';
import {
  ScrollView, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import BottomSheet from '~/baseComponents/BottomSheet';
import Header from '~/beinComponents/Header';
import ListView from '~/beinComponents/list/ListView';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import { uploadTypes } from '~/configs/resourceConfig';
import {
  groupPrivacyListDetail,
  communityPrivacyListDetail,
  groupPrivacy,
} from '~/constants/privacyTypes';
import { useKeySelector } from '~/hooks/selector';
import groupsActions from '~/storeRedux/groups/actions';
import groupsKeySelector from '~/storeRedux/groups/keySelector';

import AvatarImage from './components/AvatarImage';
import PrivacyItem from './components/PrivacyItem';
import CoverImage from './components/CoverImage';
import InfoView from './components/InfoView';
import { alertAction, _openImagePicker } from './helper';
import spacing from '~/theme/spacing';
import { useMyPermissions } from '~/hooks/permissions';

const GeneralInformation = (props: any) => {
  const { params } = props.route;
  const { id, type = 'group' } = params || {};

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const dispatch = useDispatch();
  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();

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
    canEditInfo = hasPermissionsOnScopeWithId('groups', id, PERMISSION_KEY.GROUP.EDIT_GROUP_INFO);
    canEditPrivacy = hasPermissionsOnScopeWithId('groups', id, PERMISSION_KEY.GROUP.EDIT_GROUP_PRIVACY);
    const groupDetail = useKeySelector(groupsKeySelector.groupDetail.group) || {};
    avatar = groupDetail?.icon || '';
    backgroundUrl = groupDetail?.backgroundImgUrl || '';
    organizationName = groupDetail?.name || '';
    organizationDescription = groupDetail?.description || '';
    organizationPrivacy = groupDetail?.privacy || '';
    total = useKeySelector(groupsKeySelector.groupMemberRequests)?.total || 0;
  } else {
    const communityDetail = useKeySelector(groupsKeySelector.communityDetail) || {};
    avatar = communityDetail?.icon || '';
    backgroundUrl = communityDetail?.backgroundImgUrl || '';
    canEditInfo = hasPermissionsOnScopeWithId('communities', id, PERMISSION_KEY.COMMUNITY.EDIT_COMMUNITY_INFO);
    organizationName = communityDetail?.name || '';
    organizationDescription = communityDetail?.description || '';
    organizationPrivacy = communityDetail?.privacy || '';
    canEditPrivacy = hasPermissionsOnScopeWithId('communities', id, PERMISSION_KEY.COMMUNITY.EDIT_COMMUNITY_PRIVACY);
    total = useKeySelector(groupsKeySelector.communityMemberRequests)?.total || 0;
  }

  useEffect(
    () => {
      if (type === 'group') {
        dispatch(groupsActions.getGroupDetail({ groupId: id }));
      } else {
        dispatch(groupsActions.getCommunityDetail({ communityId: id }));
      }
    }, [id],
  );

  const openGroupPrivacyModal = () => baseSheetRef?.current?.open?.();

  const editPrivacy = (item: any) => {
    if (type === 'group') {
      dispatch(groupsActions.editGroupDetail({
        data: { id, privacy: item.type },
        editFieldName: i18next.t('common:text_privacy'),
      }));
    } else {
      dispatch(groupsActions.editCommunityDetail({
        data: { id, privacy: item.type },
        editFieldName: i18next.t('common:text_privacy'),
      }));
    }
  };

  const approveAllGroupMemberRequests = () => {
    if (type === 'group') {
      dispatch(groupsActions.approveAllGroupMemberRequests({ groupId: id }));
    } else {
      dispatch(groupsActions.approveAllCommunityMemberRequests({ communityId: id }));
    }
    editPrivacy({ type: groupPrivacy.public });
  };

  const declineAllGroupMemberRequests = () => {
    if (type === 'group') {
      dispatch(groupsActions.declineAllGroupMemberRequests({ groupId: id }));
    } else {
      dispatch(groupsActions.declineAllCommunityMemberRequests({ communityId: id }));
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

  const onEditAvatar = () => _openImagePicker(
    dispatch, id, 'icon', uploadTypes.groupAvatar, type,
  );

  const onEditCover = () => _openImagePicker(
    dispatch,
    id,
    'backgroundImgUrl',
    uploadTypes.groupCover,
    type,
  );

  const renderPrivacyItem = ({ item }: {item: any}) => (
    <TouchableOpacity
      testID={`general_information.privacy_item.${item.type}`}
      onPress={() => onPrivacyMenuPress(item)}
    >
      <PrivacyItem item={item} type={type} />
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
        />
        <CoverImage
          backgroundUrl={backgroundUrl}
          testID="general_information.cover"
          onEditCover={onEditCover}
          canEditInfo={canEditInfo}
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
                  type === 'group' ? groupPrivacyListDetail : communityPrivacyListDetail
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
