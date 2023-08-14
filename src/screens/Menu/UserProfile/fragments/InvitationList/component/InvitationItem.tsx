import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import useMyInvitationsStore from '../store';
import { IInvitation } from '~/interfaces/IInvitation';
import mainTabStack from '~/router/navigator/MainStack/stack';
import { useRootNavigation } from '~/hooks/navigation';
import { Avatar, Button } from '~/baseComponents';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import DeactivatedView from '~/components/DeactivatedView';
import InvitationGroupButtons from '~/components/InvitationGroupButtons';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';

interface Props {
id: string;
groupedId: number;
}

const InvitationItem = ({ id, groupedId }: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);
  const { rootNavigation } = useRootNavigation();

  const data: IInvitation = useMyInvitationsStore((state) => state.invitationData?.[id]);
  const actions = useMyInvitationsStore((state) => state.actions);
  const requestingsAccept = useMyInvitationsStore(
    useCallback((state) => state.requestingsAccept?.[id], [id]),
  );
  const requestingsDecline = useMyInvitationsStore(
    useCallback((state) => state.requestingsDecline?.[id], [id]),
  );

  const isHideItem = useMyInvitationsStore(
    useCallback((state) => state.requestSent?.[id], [id]),
  );

  const {
    inviter, targetInfo, targetType, communityId,
  } = data || {};

  const { fullname, avatar, isDeactivated } = inviter || {};
  const { name, isRootGroup, id: groupId } = targetInfo || {};

  const onPressTarget = () => {
    if (!targetType || !communityId) return;
    if (!isRootGroup && groupId && communityId) {
      rootNavigation.navigate(
        groupStack.groupDetail, {
          groupId,
          communityId,
        },
      );
      return;
    }

    if (communityId) {
      rootNavigation.navigate(
        mainTabStack.communityDetail, {
          communityId,
        },
      );
    }
  };

  const onPressActor = () => {
    if (!inviter.id || inviter?.isDeactivated) return;

    const payload = { userId: inviter.id };
    rootNavigation.push(
      mainTabStack.userProfile, payload,
    );
  };

  const onAccept = () => {
    actions.acceptInvitation(id, groupedId);
  };

  const onDecline = () => {
    actions.declineInvitation(id, groupedId);
  };

  if (isHideItem) return null;

  const textColor = isDeactivated ? colors.grey40 : colors.neutral60;

  return (
    <View style={[styles.row, styles.container]}>
      <Button onPress={onPressActor}>
        <Avatar.Medium isRounded source={avatar} />
      </Button>
      <ViewSpacing width={spacing.margin.small} />
      <View style={styles.flex1}>
        <View style={[styles.row, styles.contentContainer]}>
          <Button style={styles.btnActor} onPress={onPressActor}>
            <Text.SubtitleM
              color={textColor}
              testID="invitation_item.inviter"
            >
              {fullname}
            </Text.SubtitleM>
          </Button>
          {isDeactivated && <DeactivatedView style={styles.deactivatedView} />}
          <Text.BodyM useI18n>
            user:text_invited_to_join
          </Text.BodyM>
          <ViewSpacing width={spacing.margin.tiny} />
          <Button onPress={onPressTarget}>
            <Text.SubtitleM
              color={colors.neutral60}
              testID="invitation_item.target_name"
            >
              {name}
            </Text.SubtitleM>
          </Button>
        </View>
        <ViewSpacing height={spacing.margin.small} />
        <InvitationGroupButtons
          isLoadingAccept={requestingsAccept}
          isLoadingDecline={requestingsDecline}
          onAccept={onAccept}
          onDecline={onDecline}
        />
      </View>
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: spacing.padding.large,
      backgroundColor: colors.white,
      alignItems: 'flex-start',
    },
    headerContainer: {
      backgroundColor: colors.white,
      padding: spacing.padding.large,
      marginTop: spacing.margin.large,
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
    deactivatedView: {
      marginHorizontal: spacing.margin.tiny,
    },
    contentContainer: {
      flexWrap: 'wrap',
    },
    btnActor: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: spacing.margin.tiny,
    },
  });
};

export default InvitationItem;
