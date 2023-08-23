import i18next from 'i18next';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/baseComponents/ScreenWrapper';
import { ResourceUploadType } from '~/interfaces/IUpload';

import AvatarImage from './components/AvatarImage';
import CoverImage from './components/CoverImage';
import InfoView from './components/InfoView';
import { _openImagePicker } from './helper';
import spacing from '~/theme/spacing';
import useMyPermissionsStore from '~/store/permissions';
import useCommunitiesStore, { ICommunitiesState } from '~/store/entities/communities';
import Divider from '~/beinComponents/Divider';
import { PermissionKey } from '~/constants/permissionScheme';
import useGroupDetailStore from '../GroupDetail/store';
import useGroupsStore from '~/store/entities/groups';
import groupsSelector from '~/store/entities/groups/selectors';
import { FieldNameImageUpload } from '~/interfaces/IGroup';

const GeneralInformation = (props: any) => {
  const { params } = props.route;
  const { id, type = 'group' } = params || {};

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  const { shouldHavePermission } = useMyPermissionsStore((state) => state.actions);
  const { getGroupDetail } = useGroupDetailStore((state) => state.actions);
  const actions = useCommunitiesStore((state: ICommunitiesState) => state.actions);

  let avatar: string;
  let backgroundUrl: string;
  let canEditInfo: boolean;
  let organizationName: string;
  let organizationDescription: string;
  let organizationPrivacy: any;
  let canEditPrivacy: boolean;
  let rootGroupId: string;
  if (type === 'group') {
    const groupDetail = useGroupsStore(groupsSelector.getGroup(id, {}));
    const { group } = groupDetail || {};
    rootGroupId = id;
    canEditInfo = shouldHavePermission(id, PermissionKey.EDIT_INFO);
    canEditPrivacy = shouldHavePermission(id, PermissionKey.EDIT_PRIVACY);
    avatar = group?.icon || '';
    backgroundUrl = group?.backgroundImgUrl || '';
    organizationName = group?.name || '';
    organizationDescription = group?.description || '';
    organizationPrivacy = group?.privacy || '';
  } else {
    const communityDetail = useCommunitiesStore((state: ICommunitiesState) => state.data[id]);
    rootGroupId = communityDetail?.groupId;
    canEditInfo = shouldHavePermission(rootGroupId, PermissionKey.EDIT_INFO);
    canEditPrivacy = shouldHavePermission(rootGroupId, PermissionKey.EDIT_PRIVACY);
    avatar = communityDetail?.icon || '';
    backgroundUrl = communityDetail?.backgroundImgUrl || '';
    organizationName = communityDetail?.name || '';
    organizationDescription = communityDetail?.description || '';
    organizationPrivacy = communityDetail?.privacy || '';
  }

  useEffect(
    () => {
      if (type === 'group') {
        getGroupDetail({ groupId: id });
      } else {
        getCommunityDetail();
      }
    }, [id],
  );

  const getCommunityDetail = () => actions.getCommunity(id);

  const onEditAvatar = () => _openImagePicker({
    id,
    fieldName: FieldNameImageUpload.ICON,
    uploadType: ResourceUploadType.groupAvatar,
    destination: type,
    rootGroupId,
  });

  const onEditCover = () => _openImagePicker({
    id,
    fieldName: FieldNameImageUpload.BACKGROUND_IMG,
    uploadType: ResourceUploadType.groupCover,
    destination: type,
    rootGroupId,
  });

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
          rootGroupId={rootGroupId}
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
