import React, { useCallback } from 'react';
import {
  StyleSheet, View, Dimensions,
} from 'react-native';
import { isEmpty } from 'lodash';
import { useTheme, ExtendedTheme } from '@react-navigation/native';
import Animated, { FadeOutDown } from 'react-native-reanimated';
import Icon from '~/baseComponents/Icon';

import NotificationAvatar from './NotificationAvatar';
import NotificationContent from './NotificationContent';
import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';
import spacing from '~/theme/spacing';
import ButtonWrapper from '~/baseComponents/Button/ButtonWrapper';
import notiSelector from '~/screens/Notification/store/selectors';
import useNotificationStore from '~/screens/Notification/store';
import InvitationGroupButtons from '../../../../components/InvitationGroupButtons';
import useNotiInvitationsStore from './store';

const { width: screenWidth } = Dimensions.get('window');

const NOT_SHOW_AVATAR_LIST = [
  NOTIFICATION_TYPE.POST_VIDEO_TO_USER_UNSUCCESSFUL,
  NOTIFICATION_TYPE.POST_VIDEO_TO_USER_SUCCESSFUL,
  NOTIFICATION_TYPE.GROUP_ADDED_TO_GROUP_TO_USER_IN_ONE_GROUP,
  NOTIFICATION_TYPE.GROUP_ASSIGNED_ROLE_TO_USER,
  NOTIFICATION_TYPE.GROUP_DEMOTED_ROLE_TO_USER,
  NOTIFICATION_TYPE.GROUP_CHANGED_PRIVACY_TO_GROUP,
  NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_ADMIN,
  NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_ADMIN_AGGREGATED,
  NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_REQUEST_CREATOR_APPROVED,
  NOTIFICATION_TYPE.GROUP_JOIN_GROUP_TO_REQUEST_CREATOR_REJECTED,
  NOTIFICATION_TYPE.GROUP_REMOVED_FROM_GROUP_TO_USER,
  NOTIFICATION_TYPE.GROUP_ADDED_TO_GROUP_TO_USER_IN_MULTIPLE_GROUPS,
  NOTIFICATION_TYPE.CONTENT_HIDE_TO_USER,
  NOTIFICATION_TYPE.SCHEDULED_MAINTENANCE_DOWNTIME,
  NOTIFICATION_TYPE.APPROVED_KYC,
  NOTIFICATION_TYPE.CHANGE_LOGS,
  NOTIFICATION_TYPE.CHANGE_USER_BADGE_COLLECTION,
  NOTIFICATION_TYPE.QUIZ_GENERATE_UNSUCCESSFUL,
  NOTIFICATION_TYPE.QUIZ_GENERATE_SUCCESSFUL,
  NOTIFICATION_TYPE.GROUP_SET_DEFAULT_INVITATION,
];

const SHOW_INVITATION_BUTTONS = [
  NOTIFICATION_TYPE.GROUP_INVITATION,
  NOTIFICATION_TYPE.GROUP_SET_INVITATION,
  NOTIFICATION_TYPE.GROUP_SET_DEFAULT_INVITATION,
];

export interface NotificationItemProps {
  onPress: (...params: any) => void;
  onPressOption: (...params: any) => void;
  testID?: string;
  id: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  onPress,
  onPressOption,
  testID,
  id,
}: NotificationItemProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  const itemValue = useNotificationStore(notiSelector.getNotificationById(id)) || {};
  const notiActions = useNotificationStore((state) => state.actions);
  const actions = useNotiInvitationsStore((state) => state.actions);
  const requestingsAccept = useNotiInvitationsStore(
    useCallback((state) => state.requestingsAccept?.[id], [id]),
  );
  const requestingsDecline = useNotiInvitationsStore(
    useCallback((state) => state.requestingsDecline?.[id], [id]),
  );

  const isShouldHideButton = useNotiInvitationsStore(
    useCallback((state) => state.needToChangeNote?.[id], [id]),
  );
  const textNote = useNotiInvitationsStore(
    useCallback((state) => state.textNotedList?.[id], [id]),
  );

  const onAccept = () => {
    notiActions.markAsRead(id);
    actions.acceptInvitation(itemValue);
  };

  const onDecline = () => {
    notiActions.markAsRead(id);
    actions.declineInvitation(itemValue);
  };

  if (!id || isEmpty(itemValue)) return null;

  const {
    isRead, updatedAt, extra, actorCount = 0, deleted,
  }: any = itemValue || {};

  if (isEmpty(itemValue) || Boolean(deleted)) return null;

  const checkShowAvatar = () => {
    if (!extra?.type) return false;
    const isNotShowAvatar = NOT_SHOW_AVATAR_LIST.findIndex((item) => item === extra.type);
    return isNotShowAvatar === -1;
  };

  const checkShowInvitationButtons = () => {
    if (!extra?.type || isShouldHideButton) return false;
    const isShowInvitationButtons = SHOW_INVITATION_BUTTONS.findIndex((item) => item === extra.type);
    return isShowInvitationButtons !== -1;
  };

  const showAvatar = checkShowAvatar();
  const showInvitationButtons = checkShowInvitationButtons();

  return (
    <Animated.View exiting={FadeOutDown}>
      <ButtonWrapper
        testID={testID}
        onPress={() => {
          onPress && onPress(itemValue);
        }}
        style={[
          styles.container,
          {
            backgroundColor: isRead ? theme.colors.white : theme.colors.purple1,
          },
        ]}
      >
        <View style={styles.contentContainer}>
          {showAvatar ? (
            <View style={styles.flex1}>
              <NotificationAvatar
                actors={extra.actors}
                actorCount={actorCount}
              />
              <NotificationContent
                isRead={isRead}
                description={extra?.description || ''}
                content={extra?.content || ''}
                updatedAt={updatedAt}
                type={extra.type}
                textNote={textNote}
              />
            </View>
          ) : (
            <NotificationContent
              isRead={isRead}
              description={extra?.description || ''}
              content={extra?.content || ''}
              updatedAt={updatedAt}
              type={extra.type}
              textNote={textNote}
            />
          )}
          <ButtonWrapper
            testID="notification.menu_button"
            style={styles.icon}
            activeOpacity={0.2}
            onPress={(e: any) => onPressOption && onPressOption({ e, item: itemValue })}
            hitSlop={{
              bottom: 20,
              left: 20,
              right: 20,
              top: 20,
            }}
          >
            <Icon
              icon="menu"
              size={20}
              tintColor={colors.neutral40}
              testID="notification.menu_button.icon"
            />
          </ButtonWrapper>
        </View>
        {
          Boolean(showInvitationButtons) && (
          <InvitationGroupButtons
            isLoadingAccept={requestingsAccept}
            isLoadingDecline={requestingsDecline}
            onAccept={onAccept}
            onDecline={onDecline}
          />
          )
        }
      </ButtonWrapper>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.padding.large,
    paddingVertical: spacing.padding.base,
    width: screenWidth,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationItem;
