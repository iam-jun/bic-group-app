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
  GroupPrivacyType,
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
import useCommunitiesStore, { ICommunitiesState } from '~/store/entities/communities';
import useCommunityController from '~/screens/communities/store';
import Divider from '~/beinComponents/Divider';

const GeneralInformation = (props: any) => {
  const { params } = props.route;
  const { id, type = 'group' } = params || {};

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  const dispatch = useDispatch();
  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const controller = useCommunityController((state) => state.actions);
  const actions = useCommunitiesStore((state: ICommunitiesState) => state.actions);

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
    const communityDetail = useCommunitiesStore((state: ICommunitiesState) => state.data[id]);
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
        getCommunityDetail();
      }
    }, [id],
  );

  const getCommunityDetail = () => actions.getCommunity(id);

  const openGroupPrivacyModal = () => baseSheetRef?.current?.open?.();

  const editPrivacy = (item: any) => {
    const data = { id, privacy: item.type };
    const editFieldName = i18next.t('common:text_privacy');
    if (type === 'group') {
      dispatch(groupsActions.editGroupDetail({ data, editFieldName }));
    } else {
      controller.editCommunityDetail(data, editFieldName);
    }
  };

  const approveAllGroupMemberRequests = () => {
    if (type === 'group') {
      dispatch(groupsActions.approveAllGroupMemberRequests({ groupId: id, total }));
    } else {
      dispatch(groupsActions.approveAllCommunityMemberRequests(
        { communityId: id, total },
      ));
    }
    editPrivacy({ type: GroupPrivacyType.PUBLIC });
  };

  const declineAllGroupMemberRequests = () => {
    if (type === 'group') {
      dispatch(groupsActions.declineAllGroupMemberRequests({ groupId: id, total }));
    } else {
      dispatch(groupsActions.declineAllCommunityMemberRequests({ communityId: id, total }));
    }
    editPrivacy({ type: GroupPrivacyType.SECRET });
  };

  const onPrivacyMenuPress = (item: any) => {
    baseSheetRef.current?.close();

    if (organizationPrivacy === GroupPrivacyType.PRIVATE && total > 0) {
      if (item.type === GroupPrivacyType.PUBLIC) {
        alertAction(
          dispatch,
          theme,
          i18next.t('groups:update_privacy_modal:title'),
          i18next.t('groups:update_privacy_modal:content:approve'),
          approveAllGroupMemberRequests,
        );
      }

      if (item.type === GroupPrivacyType.SECRET) {
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
      <Header title={i18next.t('settings:title_edit_profile_info')} />
      <ScrollView>
        <Divider color={colors.gray5} size={spacing.padding.large} />
        <AvatarImage
          avatar={avatar}
          testID="general_information.avatar"
          onEditAvatar={onEditAvatar}
          canEditInfo={canEditInfo}
        />
        <Divider color={colors.gray5} size={spacing.padding.large} />
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
              <Text.H4
                color={colors.neutral80}
                style={styles.privacyTypeText}
                useI18n
              >
                settings:title_privacy_type
              </Text.H4>
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

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray5,
    },
    contentBottomSheet: {
      paddingHorizontal: spacing.padding.large,
      paddingTop: spacing.padding.small,
    },
    privacyTypeText: {
      marginBottom: spacing.margin.big,
    },
  });
};
