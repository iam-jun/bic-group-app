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

export interface MembershipPolicySettingsProps {
  route: {
    params: {
      id: string;
      type: ITypeGroup;
    };
  };
}

const MembershipPolicySettings: FC<MembershipPolicySettingsProps> = (props) => {
  const { params } = props.route;
  const { id, type = ITypeGroup.GROUP } = params || {};

  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);

  const groupDetail = useGroupsStore(groupsSelector.getGroup(id, {}));
  const { getGroupDetail } = useGroupDetailStore((state) => state.actions);
  const communityDetail = useCommunitiesStore((state) => state.data[id]);
  const { getCommunity } = useCommunitiesStore((state) => state.actions);
  const { updateGroupJoinSetting } = useGroupMemberStore((state) => state.actions);
  const { updateCommunityJoinSetting } = useCommunityController((state) => state.actions);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    if (type === ITypeGroup.COMMUNITY) {
      await getCommunity(id);
    } else {
      await getGroupDetail({ groupId: id });
    }
    setIsLoading(false);
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

  const _updateJoinSetting = (setting: IGroupSettings) => {
    if (type === ITypeGroup.COMMUNITY) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      updateJoinSetting?.({ communityId: id, groupId: data?.groupId, ...setting });
    } else {
      updateJoinSetting?.({ groupId: id, ...setting });
    }
  };

  return (
    <ScreenWrapper testID="membership_policy_settings" isFullView style={styles.container}>
      <Header title={t('settings:membership_policy_settings:title')} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={getData} />}
      >
        <Divider size={spacing.margin.large} />
        <Text.BodyS style={styles.itemContainer} color={colors.neutral40}>
          {t('settings:membership_policy_settings:description')}
        </Text.BodyS>
        <Divider size={spacing.margin.xTiny / 2} />
        <OptionsWhoCanJoin data={data} updateJoinSetting={_updateJoinSetting} />
        <Divider size={spacing.margin.large} />
        <MembershipApproval data={data} updateJoinSetting={_updateJoinSetting} />
      </ScrollView>
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
  });
};
