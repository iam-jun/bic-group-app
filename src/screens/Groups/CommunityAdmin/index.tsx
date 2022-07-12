import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Header from '~/beinComponents/Header';
import Divider from '~/beinComponents/Divider';
import {ITheme} from '~/theme/interfaces';
import {useRootNavigation} from '~/hooks/navigation';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../redux/keySelector';
import Text from '~/beinComponents/Text';
import MenuItem from '~/beinComponents/list/items/MenuItem';
import modalActions from '~/store/modal/actions';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import groupsActions from '../redux/actions';

const CommunityAdmin = () => {
  const theme = useTheme() as ITheme;
  const styles = createStyles(theme);
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {
    id: communityId,
    name,
    icon,
    can_manage_scheme,
    can_edit_info,
    can_manage_member,
  } = useKeySelector(groupsKeySelector.communityDetail);
  const {total} = useKeySelector(groupsKeySelector.communityMemberRequests);

  useEffect(() => {
    can_manage_member &&
      dispatch(groupsActions.getCommunityMemberRequests({communityId}));

    return () => {
      dispatch(groupsActions.resetCommunityMemberRequests());
    };
  }, [communityId]);

  const displayNewFeature = () => dispatch(modalActions.showAlertNewFeature());

  const onPressPendingMembers = () => {
    rootNavigation.navigate(groupStack.communityPendingMembers);
  };

  const onPressGeneralInfo = () => {
    rootNavigation.navigate(groupStack.generalInfo, {
      id: communityId,
      type: 'community',
    });
  };

  const onPressPermission = () => {
    rootNavigation.navigate(groupStack.communityPermission);
  };

  const onPressGroupStructure = () => {
    rootNavigation.navigate(groupStack.groupStructureSettings);
  };

  const renderModerating = () => (
    <>
      <Text.Body
        style={styles.headerTitle}
        color={theme.colors.textPrimary}
        variant="body"
        useI18n>
        settings:title_community_moderating
      </Text.Body>
      {!!can_manage_member && (
        <MenuItem
          testID={'community_admin.pending_members'}
          title={'settings:title_pending_members'}
          icon={'UserExclamation'}
          iconProps={{
            icon: 'UserExclamation',
            tintColor: theme.colors.primary6,
          }}
          notificationsBadgeNumber={total}
          notificationsBadgeProps={{maxNumber: 99, variant: 'alert'}}
          rightSubIcon="AngleRightB"
          onPress={onPressPendingMembers}
        />
      )}
      <MenuItem
        testID={'community_admin.pending_posts'}
        title={'settings:title_pending_posts'}
        icon={'FileExclamationAlt'}
        iconProps={{
          icon: 'FileExclamationAlt',
          tintColor: theme.colors.primary6,
        }}
        notificationsBadgeNumber={999}
        notificationsBadgeProps={{maxNumber: 99, variant: 'alert'}}
        rightSubIcon="AngleRightB"
        onPress={displayNewFeature}
      />
    </>
  );

  const renderSettings = () => (
    <>
      <Text.Body
        style={styles.headerTitle}
        color={theme.colors.textPrimary}
        variant="body"
        useI18n>
        settings:title_community_settings
      </Text.Body>
      {!!can_edit_info && (
        <MenuItem
          testID="community_admin.profile_info"
          title="settings:title_profile_info"
          icon="Gear"
          iconProps={{icon: 'Gear', tintColor: theme.colors.primary6}}
          rightSubIcon="AngleRightB"
          onPress={onPressGeneralInfo}
        />
      )}
      {!!can_edit_info && ( //todo temp use can edit info, should use correct permission when BE update
        <MenuItem
          testID="community_admin.group_structure_settings"
          title="settings:title_group_structure"
          icon="CodeBranch"
          iconProps={{icon: 'CodeBranch', tintColor: theme.colors.primary6}}
          rightSubIcon="AngleRightB"
          onPress={onPressGroupStructure}
        />
      )}
      {!!can_manage_scheme && (
        <MenuItem
          testID="community_admin.permission_settings"
          title="settings:title_permission_settings"
          icon="FileLockAlt"
          iconProps={{icon: 'FileLockAlt', tintColor: theme.colors.primary6}}
          rightSubIcon="AngleRightB"
          onPress={onPressPermission}
        />
      )}
      <MenuItem
        testID="community_admin.post_settings"
        title="settings:title_post_settings"
        icon="FileCopyAlt"
        iconProps={{icon: 'FileCopyAlt', tintColor: theme.colors.primary6}}
        rightSubIcon="AngleRightB"
        onPress={displayNewFeature}
      />
    </>
  );

  return (
    <ScreenWrapper testID="CommunityAdmin" isFullView>
      <Header
        title={name}
        titleTextProps={{color: theme.colors.textPrimary}}
        avatar={icon}
      />
      <Divider size={4} />
      <View style={styles.container}>
        {renderModerating()}
        {renderSettings()}
      </View>
    </ScreenWrapper>
  );
};

const createStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    container: {
      paddingTop: spacing.padding.large,
    },
    headerTitle: {
      marginHorizontal: spacing.margin.large,
      marginVertical: spacing.margin.base,
    },
  });
};

export default CommunityAdmin;
