import i18next from 'i18next';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { uploadTypes } from '~/configs/resourceConfig';
import { useKeySelector } from '~/hooks/selector';
import groupsActions from '~/storeRedux/groups/actions';
import groupsKeySelector from '~/storeRedux/groups/keySelector';

import AvatarImage from './components/AvatarImage';
import CoverImage from './components/CoverImage';
import InfoView from './components/InfoView';
import { _openImagePicker } from './helper';
import spacing from '~/theme/spacing';
import { useMyPermissions } from '~/hooks/permissions';
import useCommunitiesStore, { ICommunitiesState } from '~/store/entities/communities';
import Divider from '~/beinComponents/Divider';

const GeneralInformation = (props: any) => {
  const { params } = props.route;
  const { id, type = 'group' } = params || {};

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  const dispatch = useDispatch();
  const { hasPermissionsOnScopeWithId, PERMISSION_KEY } = useMyPermissions();
  const actions = useCommunitiesStore((state: ICommunitiesState) => state.actions);

  let avatar: string;
  let backgroundUrl: string;
  let canEditInfo: boolean;
  let organizationName: string;
  let organizationDescription: string;
  let organizationPrivacy: any;
  let canEditPrivacy: boolean;
  let isJoinApproval: boolean;
  if (type === 'group') {
    canEditInfo = hasPermissionsOnScopeWithId('groups', id, PERMISSION_KEY.GROUP.EDIT_GROUP_INFO);
    canEditPrivacy = hasPermissionsOnScopeWithId('groups', id, PERMISSION_KEY.GROUP.EDIT_GROUP_PRIVACY);
    const groupDetail = useKeySelector(groupsKeySelector.groupDetail.group) || {};
    avatar = groupDetail?.icon || '';
    backgroundUrl = groupDetail?.backgroundImgUrl || '';
    organizationName = groupDetail?.name || '';
    organizationDescription = groupDetail?.description || '';
    organizationPrivacy = groupDetail?.privacy || '';
    isJoinApproval = groupDetail?.settings?.isJoinApproval;
  } else {
    const communityDetail = useCommunitiesStore((state: ICommunitiesState) => state.data[id]);
    avatar = communityDetail?.icon || '';
    backgroundUrl = communityDetail?.backgroundImgUrl || '';
    canEditInfo = hasPermissionsOnScopeWithId('communities', id, PERMISSION_KEY.COMMUNITY.EDIT_COMMUNITY_INFO);
    organizationName = communityDetail?.name || '';
    organizationDescription = communityDetail?.description || '';
    organizationPrivacy = communityDetail?.privacy || '';
    canEditPrivacy = hasPermissionsOnScopeWithId('communities', id, PERMISSION_KEY.COMMUNITY.EDIT_COMMUNITY_PRIVACY);
    isJoinApproval = communityDetail?.settings?.isJoinApproval;
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

  return (
    <ScreenWrapper
      testID="general_information"
      style={styles.container}
      isFullView
    >
      <Header title={i18next.t('settings:title_edit_profile_info')} />
      <ScrollView showsVerticalScrollIndicator={false}>
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
          type={type}
          canEditInfo={canEditInfo}
          canEditPrivacy={canEditPrivacy}
          name={organizationName}
          privacy={organizationPrivacy}
          description={organizationDescription}
          isJoinApproval={isJoinApproval}
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
      paddingTop: spacing.padding.small,
    },
    privacyTypeText: {
      marginBottom: spacing.margin.big,
      marginHorizontal: spacing.margin.large,
    },
    listView: {
      marginHorizontal: spacing.margin.large,
    },
    noteView: {
      backgroundColor: colors.gray1,
      marginTop: spacing.margin.big,
      paddingHorizontal: spacing.margin.large,
      paddingVertical: spacing.margin.base,
    },
  });
};
