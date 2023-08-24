import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { GroupList } from '~/components/groups';
import spacing from '~/theme/spacing';
import Text from '~/baseComponents/Text';
import useGroupSetInvitationsStore from './store';
import { IGroup } from '~/interfaces/IGroup';
import EmptyScreen from '~/components/EmptyScreen';
import dimension from '~/theme/dimension';
import { IInviter } from '~/interfaces/IInvitation';
import useBaseHook from '~/hooks/baseHook';
import { ICommunity } from '~/interfaces/ICommunity';
import { useRootNavigation } from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';
import useModalStore from '~/store/modal';

interface Props {
   isFullScreen?: boolean;
   inviter: IInviter;
   invitaionId: string;
}

const InvitationGroupSet = ({
  isFullScreen = false,
  inviter,
  invitaionId,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const { colors } = theme;
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const { fullname } = inviter || {};

  const data = useGroupSetInvitationsStore((state) => state.data);
  const loading = useGroupSetInvitationsStore((state) => state.loading);
  const totalGroups = useGroupSetInvitationsStore((state) => state.totalGroups);
  const modalActions = useModalStore((state) => state.actions);
  const actions = useGroupSetInvitationsStore((state) => state.actions);
  const isRefresing = useGroupSetInvitationsStore((state) => state.isRefresing);
  const resetData = useGroupSetInvitationsStore((state) => state.reset);

  useEffect(() => () => {
    resetData();
  }, []);

  const onRefresh = () => {
    actions.getGroups(invitaionId, true);
  };

  const onPressGroup = (group: IGroup| ICommunity) => {
    const { id: groupId, communityId } = group || {};
    modalActions.hideModal();
    if (group?.level === 0) {
      rootNavigation.navigate(mainStack.communityDetail, { communityId });
    } else {
      rootNavigation.navigate(mainStack.groupDetail, { groupId, communityId });
    }
  };

  const renderEmptyComponent = () => {
    if (loading) {
      return null;
    }

    return (
      <EmptyScreen
        icon="addUsers"
        title="communities:empty_groups:title"
        description="communities:empty_groups:description"
      />
    );
  };

  const textInvited = `${t('user:text_invited_to_join')} ${totalGroups} ${t('post:label_groups').toLowerCase()}`;

  return (
    <View style={[styles.container, !isFullScreen && styles.notFullContainer]}>
      {!Boolean(isFullScreen)
      && (
      <Text.H3 useI18n style={styles.title}>
        user:text_invitation_detail
      </Text.H3>
      )}
      <View style={[styles.headerContainer]}>
        <Text.SubtitleM>
          {`${fullname} `}
          <Text.BodyM>
            {` ${textInvited}`}
          </Text.BodyM>
        </Text.SubtitleM>
      </View>
      <GroupList
        mode="tree"
        resetOnHide={false}
        data={data}
        loading={loading}
        onPressItem={onPressGroup}
        refreshControl={(
          <RefreshControl
            refreshing={!!isRefresing}
            onRefresh={onRefresh}
            tintColor={colors.gray40}
          />
)}
        ListEmptyComponent={renderEmptyComponent}
        itemProps={{ isNotCollapsible: true }}
      />
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.large,
      backgroundColor: colors.white,
      flex: 1,
    },
    title: {
      marginVertical: spacing.margin.base,
    },
    headerContainer: {
      backgroundColor: colors.white,
      paddingVertical: spacing.padding.base,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textContainer: {
      justifyContent: 'space-between',
    },
    loading: {
      marginTop: spacing.margin.large,
    },
    flex1: {
      flex: 1,
    },
    notFullContainer: {
      height: 0.8 * dimension.deviceHeight,
    },
  });
};

export default InvitationGroupSet;
