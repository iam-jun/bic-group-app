import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import useMyInvitationsStore from '../store';
import {
  IInvitation, IInvitationsTargetType, IInviter, ITargetInfo,
} from '~/interfaces/IInvitation';
import mainTabStack from '~/router/navigator/MainStack/stack';
import { useRootNavigation } from '~/hooks/navigation';
import { Avatar, Button } from '~/baseComponents';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import DeactivatedView from '~/components/DeactivatedView';
import InvitationGroupButtons from '~/components/InvitationGroupButtons';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';
import { useBaseHook } from '~/hooks';
import useGroupSetInvitationsStore from '~/components/InvitationGroupSet/store';
import useModalStore from '~/store/modal';
import InvitationGroupSet from '~/components/InvitationGroupSet';

interface Props {
id: string;
groupedId: number;
}

const InvitationItem = ({ id, groupedId }: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();

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

  const groupSetActions = useGroupSetInvitationsStore((state) => state.actions);
  const modalActions = useModalStore((state) => state.actions);

  const {
    inviter, targetInfo, targetType, communityId,
  } = data || {};

  const { fullname, avatar, isDeactivated } = inviter || {};
  const {
    name, isRootGroup, id: groupId,
  } = targetInfo || {};
  const isGroupSet = targetType === IInvitationsTargetType.GROUP_SET;

  const onPressTarget = (textName: string) => {
    if (textName === name) {
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
      return;
    }

    groupSetActions.getGroups(id);
    modalActions.showModal({
      isOpen: true,
      ContentComponent: <InvitationGroupSet inviter={inviter} invitaionId={id} />,
    });
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
  const textInvited = t(`${getInvitatedText({ targetType, targetInfo, inviter })}`);
  const shouldHideAvatarInvitor = shouldHideAvatar({ targetType, targetInfo, inviter });
  const textName = isGroupSet ? t('user:text_set_of_groups') : name;

  return (
    <View testID="invitation_item.container" style={[styles.row, styles.container]}>
      {!Boolean(shouldHideAvatarInvitor)
      && (
      <Button testID="invitation_item.actor" onPress={onPressActor}>
        <Avatar.Medium isRounded source={avatar} />
      </Button>
      )}
      <ViewSpacing width={spacing.margin.small} />
      <View style={styles.flex1}>
        <View style={[styles.row, styles.contentContainer]}>
          <Text.SubtitleM>
            {!Boolean(shouldHideAvatarInvitor) && (
              <>
                <Text.SubtitleM
                  testID="invitation_item.actor_name"
                  color={textColor}
                  onPress={onPressActor}
                >
                  {`${fullname} `}
                </Text.SubtitleM>
                {isDeactivated && <DeactivatedView style={styles.deactivatedView} />}
              </>
            )}
            <Text.BodyM>
              {!Boolean(shouldHideAvatarInvitor) ? ` ${textInvited} ` : `${textInvited} `}
            </Text.BodyM>
            <Text.SubtitleM
              color={colors.neutral60}
              testID="invitation_item.target_name"
              onPress={() => onPressTarget(textName)}
            >
              {` ${textName}`}
            </Text.SubtitleM>
            {Boolean(shouldHideAvatarInvitor) && (
              <>
                <Text.BodyM>
                  {` ${t('user:text_as_you_join')} `}
                </Text.BodyM>
                <Text.SubtitleM
                  color={colors.neutral60}
                  testID="invitation_item.target_name"
                  onPress={() => onPressTarget(name)}
                >
                  {` ${name}`}
                </Text.SubtitleM>
              </>
            )}
          </Text.SubtitleM>
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

const getInvitatedText = ({
  targetType, targetInfo, inviter,
}:{targetType: IInvitationsTargetType, targetInfo: ITargetInfo, inviter: IInviter}) => {
  if (!targetType || !targetInfo) return '';
  if (targetType === IInvitationsTargetType.GROUP_SET) {
    if (targetInfo?.isDefaultGroupSet && !inviter?.id) return 'user:text_default_group_set';
    return 'user:text_invited_you_to_join_a';
  }
  return 'user:text_invited_to_join';
};

const shouldHideAvatar = ({
  targetType, targetInfo, inviter,
}:{targetType: IInvitationsTargetType, targetInfo: ITargetInfo, inviter: IInviter}) => (
  targetType === IInvitationsTargetType.GROUP_SET && targetInfo?.isDefaultGroupSet && !inviter?.id
);

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
