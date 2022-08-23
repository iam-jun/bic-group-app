import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { groupPrivacyListDetail } from '~/constants/privacyTypes';
import { spacing } from '~/theme';
import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import ButtonCommunityGroupCardAction from './ButtonCommunityGroupCardAction';
import { useRootNavigation } from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import groupsActions from '~/storeRedux/groups/actions';
import { Avatar, Button } from '~/baseComponents';
import { formatLargeNumber } from '~/utils/formatData';
import Tag from '~/baseComponents/Tag';
import { useBaseHook } from '~/hooks';
import { isGroup } from '~/screens/groups/helper';

type CommunityGroupCardProps = {
  item: any;
  testID?: string;
};

const Index: FC<CommunityGroupCardProps> = ({ item, testID }) => {
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
    level,
    community,
  } = item || {};
  const privacyData: any
    = groupPrivacyListDetail.find((i) => i?.type === privacy) || {};
  const { icon: privacyIcon, title: privacyTitle } = privacyData || {};

  const onView = () => {
    if (isGroup(level)) {
      rootNavigation.navigate(groupStack.groupDetail, { groupId: id });
      return;
    }

    rootNavigation.navigate(groupStack.communityDetail, { communityId: id });
  };

  const onJoin = () => {
    if (isGroup(level)) {
      dispatch(groupsActions.joinNewGroup({ groupId: id, groupName: name }));
      return;
    }

    dispatch(
      groupsActions.joinCommunity({ communityId: id, communityName: name }),
    );
  };

  const onCancel = () => {
    if (isGroup(level)) {
      dispatch(groupsActions.cancelJoinGroup({ groupId: id, groupName: name }));
      return;
    }

    dispatch(
      groupsActions.cancelJoinCommunity({
        communityId: id,
        communityName: name,
      }),
    );
  };

  const onViewCommunity = () => {
    if (community) {
      const { id } = community;
      rootNavigation.navigate(groupStack.communityDetail, { communityId: id });
    }
  };

  return (
    <View testID={testID} style={[styles.container, elevations.e1]}>
      {isGroup(level) && (
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
              <Tag
                style={styles.tagContainer}
                type="secondary"
                size="small"
                label={t(
                  isGroup(level) ? 'common:text_group' : 'common:text_community',
                )}
              />
              <ViewSpacing height={spacing.margin.xSmall} />
              <View style={styles.row}>
                <View style={[styles.row, styles.privacyView]}>
                  <Icon
                    style={styles.iconSmall}
                    icon={privacyIcon}
                    size={16}
                    tintColor={colors.gray50}
                  />
                  <Text.BodyS color={colors.neutral40} useI18n>
                    {privacyTitle}
                  </Text.BodyS>
                </View>
                <ViewSpacing width={spacing.margin.extraLarge} />
                <View style={styles.row}>
                  <Text.BodySMedium style={styles.textNumberMember}>
                    {formatLargeNumber(userCount)}
                  </Text.BodySMedium>
                  <Text.BodyS color={colors.neutral40} useI18n>
                    common:members
                  </Text.BodyS>
                </View>
              </View>
            </View>
          </View>
          {!!description && (
            <>
              <ViewSpacing height={10} />
              <Text.BodyM numberOfLines={2}>{`${description}`}</Text.BodyM>
            </>
          )}
        </View>
      </Button>
      <ViewSpacing height={spacing.margin.base} />
      <ButtonCommunityGroupCardAction
        joinStatus={joinStatus}
        onView={onView}
        onJoin={onJoin}
        onCancel={onCancel}
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
    privacyView: {
      width: 100,
    },
    containerInfo: {
      flex: 1,
      marginLeft: 10,
    },
    iconSmall: {
      marginRight: spacing.margin.small,
      height: 16,
    },
    textNumberMember: {
      marginRight: spacing.margin.small,
    },
    textNameCommunityOnGroup: {
      marginBottom: spacing.margin.tiny,
    },
    tagContainer: {
      alignSelf: 'baseline',
    },
  });
};

export default Index;
