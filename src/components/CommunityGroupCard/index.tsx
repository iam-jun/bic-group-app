import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Avatar, Button } from '~/baseComponents';
import Icon from '~/baseComponents/Icon';
import Tag from '~/baseComponents/Tag';
import Text from '~/baseComponents/Text';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import { GroupPrivacyDetail } from '~/constants/privacyTypes';
import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { isGroup } from '~/helpers/groups';
import useCommunitiesStore, { ICommunitiesState } from '~/store/entities/communities';
import modalActions from '~/storeRedux/modal/actions';
import { spacing } from '~/theme';
import { formatLargeNumber } from '~/utils/formatData';
import ButtonCommunityGroupCard from './ButtonCommunityGroupCard';

type CommunityGroupCardProps = {
  item: any;
  testID?: string;
  shouldShowAlertJoinTheCommunityFirst?: boolean;
  onJoin?: (id: string, name: string, isGroup?: boolean)=>void;
  onCancel?: (id: string, name: string, isGroup?: boolean)=>void;
};

const CommunityGroupCard: FC<CommunityGroupCardProps> = ({
  item,
  testID,
  shouldShowAlertJoinTheCommunityFirst,
  onJoin,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { colors, elevations } = theme;

  const {
    id,
    name,
    icon,
    userCount,
    privacy,
    joinStatus,
    description,
    community,
  } = item || {};
  const privacyData: any = GroupPrivacyDetail[privacy] || {};
  const { icon: privacyIcon, title: privacyTitle } = privacyData;
  const actions = useCommunitiesStore((state: ICommunitiesState) => state.actions);

  const onView = () => {
    if (isGroup(item)) {
      // in group detail we need some infomation from community detail,
      // so before navigate to group detail we need to fetch community detail
      // and clear community detail when go back from group detail
      actions.getCommunity(community.id);

      rootNavigation.navigate(
        groupStack.groupDetail,
        {
          groupId: id,
          communityId: community.id,
        },
      );
      return;
    }

    // if a community has community field, then it is in manage api
    // so need to pick id from community field
    // otherwise pick id by normal
    rootNavigation.navigate(
      groupStack.communityDetail,
      { communityId: community ? community.id : id },
    );
  };

  const handleJoin = () => {
    if (!!shouldShowAlertJoinTheCommunityFirst && community?.joinStatus === GroupJoinStatus.VISITOR) {
      dispatch(modalActions.showAlert({
        title: t('communities:browse_groups:guest_view_alert:title'),
        content: t('communities:browse_groups:guest_view_alert:content'),
        confirmLabel: t('common:text_ok'),
      }));
      return;
    }
    if (!!onJoin) {
      onJoin(id, name, isGroup(item));
    }
  };

  const handleCancel = () => {
    if (!!onCancel) {
      onCancel(id, name, isGroup(item));
    }
  };

  const onViewCommunity = () => {
    if (community) {
      const { id } = community;
      rootNavigation.navigate(groupStack.communityDetail, { communityId: id });
    }
  };

  return (
    <View testID={testID} style={[styles.container, elevations.e1]}>
      {isGroup(item) && (
        <Button onPress={onViewCommunity}>
          <Text.SubtitleS
            style={styles.textNameCommunityOnGroup}
            color={colors.blue50}
            numberOfLines={1}
          >
            {community?.name}
          </Text.SubtitleS>
        </Button>
      )}
      <Button onPress={onView}>
        <View>
          <View style={styles.row}>
            <Avatar.XLarge source={icon} />
            <View style={styles.containerInfo}>
              <Text.H6 numberOfLines={2}>{name}</Text.H6>
              <ViewSpacing height={spacing.margin.tiny} />
              <View style={styles.row}>
                <View style={styles.row}>
                  <Icon
                    style={styles.iconSmall}
                    icon={privacyIcon}
                    size={16}
                    tintColor={colors.neutral20}
                  />
                  <Text.BodySMedium color={colors.neutral40} useI18n>
                    {privacyTitle}
                  </Text.BodySMedium>
                </View>
                <ViewSpacing width={spacing.margin.large} />
                <View style={styles.row}>
                  <Icon
                    style={styles.iconSmall}
                    icon="UserGroupSolid"
                    size={16}
                    tintColor={colors.neutral20}
                  />
                  <Text.BodySMedium color={colors.neutral40}>
                    {formatLargeNumber(userCount)}
                  </Text.BodySMedium>
                </View>
              </View>
              <ViewSpacing height={spacing.margin.xSmall} />
              <Tag
                style={styles.tagContainer}
                type="secondary"
                size="small"
                label={t(
                  isGroup(item) ? 'common:text_group' : 'common:text_community',
                )}
              />
            </View>
          </View>
          {!!description && (
            <>
              <ViewSpacing height={8} />
              <Text.ParagraphM numberOfLines={2}>{`${description}`}</Text.ParagraphM>
            </>
          )}
        </View>
      </Button>
      <ViewSpacing height={spacing.margin.base} />
      <ButtonCommunityGroupCard
        joinStatus={joinStatus}
        onView={onView}
        onJoin={handleJoin}
        onCancel={handleCancel}
      />
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      paddingTop: 10,
      paddingBottom: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    containerInfo: {
      flex: 1,
      marginLeft: 10,
    },
    iconSmall: {
      marginRight: spacing.margin.small,
      height: 16,
    },
    textNameCommunityOnGroup: {
      marginBottom: spacing.margin.tiny,
    },
    tagContainer: {
      alignSelf: 'baseline',
    },
  });
};

export default CommunityGroupCard;
