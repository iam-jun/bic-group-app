import { t } from 'i18next';
import React, { FC, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';

import spacing from '~/theme/spacing';
import Divider from '~/beinComponents/Divider';
import Text from '~/baseComponents/Text';
import MembershipApproval from './components/MembershipApproval';
import { IGroupSettings, ITypeGroup } from '~/interfaces/common';
import OptionsWhoCanJoin from './components/OptionsWhoCanJoin';
import useGroupsStore from '~/store/entities/groups';
import groupsSelector from '~/store/entities/groups/selectors';
import useCommunitiesStore from '~/store/entities/communities';
import useGroupMemberStore from '../GroupMembers/store';
import useCommunityController from '~/screens/communities/store';
import { ICommunity } from '~/interfaces/ICommunity';
import { IGroup } from '~/interfaces/IGroup';
import useGroupDetailStore from '../GroupDetail/store';
import useMembershipPolicySettingsStore from './store';
import ChangeSettings from './components/ChangeSettings';
import useModalStore from '~/store/modal';
import { previewSettings } from './store/helper';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';

export interface MembershipPolicySettingsProps {
  route: {
    params: {
      groupId: string;
      communityId?: string;
      type?: ITypeGroup;
    };
  };
}

const MembershipPolicySettings: FC<MembershipPolicySettingsProps> = (props) => {
  const { params } = props.route;
  const { communityId, groupId, type = ITypeGroup.GROUP } = params || {};

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  const groupDetail = useGroupsStore(groupsSelector.getGroup(groupId, {}));
  const { getGroupDetail } = useGroupDetailStore((state) => state.actions);
  const communityDetail = useCommunitiesStore((state) => state.data[communityId]);
  const { getCommunity } = useCommunitiesStore((state) => state.actions);
  const { updateGroupJoinSetting } = useGroupMemberStore((state) => state.actions);
  const { updateCommunityJoinSetting } = useCommunityController((state) => state.actions);
  const {
    data: { settings, changeableSettings },
    actions: { getSettings },
    reset,
  } = useMembershipPolicySettingsStore((state) => state);
  const modalActions = useModalStore((state) => state.actions);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      await getData();
      setIsLoading(false);
    })();
    return () => {
      reset();
    };
  }, []);

  const getData = async () => {
    await Promise.all([getSettings(groupId), _getGroupDetail()]);
  };

  const _getGroupDetail = async () => {
    if (type === ITypeGroup.COMMUNITY) {
      await getCommunity(communityId);
    } else {
      await getGroupDetail({ groupId });
    }
  };

  const onRefresh = async () => {
    setIsRefresh(true);
    await getData();
    setIsRefresh(false);
  };

  let updateJoinSetting: any;
  let data: ICommunity | IGroup;
  if (type === ITypeGroup.COMMUNITY) {
    data = communityDetail;
    updateJoinSetting = updateCommunityJoinSetting;
  } else {
    data = groupDetail.group;
    updateJoinSetting = updateGroupJoinSetting;
  }

  const _updateJoinSetting = async (setting: IGroupSettings) => {
    try {
      const { isJoinApproval, isInvitedOnly } = setting;
      const payload = {
        groupId,
        settings: { ...setting },
      };
      const isShowModalChangeSettings = await previewSettings(payload);
      if (isShowModalChangeSettings && (isJoinApproval || isInvitedOnly)) {
        modalActions.showModal({
          isOpen: true,
          ContentComponent: (
            <ChangeSettings
              isChangeMembershipApproval={isJoinApproval}
              name={data?.name}
              updateJoinSetting={() => handleUpdateJoinSetting(setting)}
            />
          ),
        });
        return;
      }

      handleUpdateJoinSetting(setting);
    } catch (error) {
      return null;
    }
  };

  const handleUpdateJoinSetting = (setting: IGroupSettings) => {
    if (type === ITypeGroup.COMMUNITY) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      updateJoinSetting?.({ communityId, groupId, settings: setting });
    } else {
      updateJoinSetting?.({ groupId, settings: setting });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator style={styles.loading} size="large" />;
    }
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />}
      >
        <Divider size={spacing.margin.large} />
        <Text.BodyS style={styles.itemContainer} color={colors.neutral40}>
          {t('settings:membership_policy_settings:description')}
        </Text.BodyS>
        <Divider size={spacing.margin.xTiny / 2} />
        <OptionsWhoCanJoin
          data={data}
          settings={settings}
          changeableSettings={changeableSettings}
          updateJoinSetting={_updateJoinSetting}
        />
        <Divider size={spacing.margin.large} />
        <MembershipApproval
          data={data}
          settings={settings}
          changeableSettings={changeableSettings}
          updateJoinSetting={_updateJoinSetting}
        />
      </ScrollView>
    );
  };

  return (
    <ScreenWrapper testID="membership_policy_settings" isFullView style={styles.container}>
      <Header title={t('settings:membership_policy_settings:title')} />
      {renderContent()}
    </ScreenWrapper>
  );
};

export default MembershipPolicySettings;

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      backgroundColor: colors.neutral5,
    },
    itemContainer: {
      padding: spacing.padding.large,
      backgroundColor: colors.white,
    },
    loading: {
      marginTop: spacing.margin.large,
    },
  });
};
