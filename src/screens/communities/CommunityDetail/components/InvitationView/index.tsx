import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import React, { useContext, useState } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { t } from 'i18next';
import { Avatar } from '~/baseComponents';
import Text from '~/baseComponents/Text';
import { formatLongTime } from '~/beinComponents/TimeView/helper';
import { IInvitation } from '~/interfaces/IGroup';
import { AppContext } from '~/contexts/AppContext';
import { ITypeGroup } from '~/interfaces/common';
import { spacing } from '~/theme';
import images from '~/resources/images';
import useNotiInvitationsStore from '~/screens/Notification/components/NotificationItem/store';
import useCommunitiesStore from '~/store/entities/communities';
import useGroupDetailStore from '~/screens/groups/GroupDetail/store';
import InvitationGroupButtons from '~/components/InvitationGroupButtons';

interface InvitationViewProps {
  data: IInvitation | undefined;
  type: ITypeGroup;
  communityId: string | '';
  groupId: string | '';
  style?: StyleProp<ViewStyle>;
}

const InvitationView = ({
  style, data, type, communityId, groupId,
}: InvitationViewProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { language } = useContext(AppContext);

  const actions = useNotiInvitationsStore((state) => state.actions);

  const { invitedAt, inviter, id } = data || {};
  const { fullname, avatar } = inviter || {};

  const [isLoadingAccept, setIsLoadingAccept] = useState(false);
  const [isLoadingDecline, setIsLoadingDecline] = useState(false);

  const renderTime = () => formatLongTime(invitedAt, language);

  const onDecline = async () => {
    setIsLoadingDecline(true);
    await actions.declineSingleInvitation({ invitationId: id, callback });
    setIsLoadingDecline(false);
  };

  const onAccept = async () => {
    setIsLoadingAccept(true);
    await actions.acceptSingleInvitation({ invitationId: id, callback });
    setIsLoadingAccept(false);
  };

  const callback = () => {
    if (type === ITypeGroup.COMMUNITY) {
      const { getCommunity } = useCommunitiesStore.getState().actions;
      getCommunity(communityId);
    } else {
      const { getGroupDetail } = useGroupDetailStore.getState().actions;
      getGroupDetail({ groupId });
    }
  };

  if (!data) return null;

  return (
    <View style={styles.wrapper} testID="invitation_view">
      <View style={[styles.container, style]}>
        <View style={styles.content}>
          <Avatar.Base source={avatar || images.img_user_avatar_default} isRounded />
          <View style={styles.text}>
            <Text.SubtitleM color={theme.colors.neutral80}>
              {fullname}
              {' '}
              <Text.BodyM color={theme.colors.neutral80}>
                {t(`common:text_invited_you_to_join_this_${type}`)}
              </Text.BodyM>
            </Text.SubtitleM>
            <Text.BodyXS numberOfLines={1} color={theme.colors.neutral40} style={styles.time}>
              {t('common:text_invited')}
              {' '}
              {renderTime()}
            </Text.BodyXS>
          </View>
        </View>
        <InvitationGroupButtons
          isLoadingAccept={isLoadingAccept}
          isLoadingDecline={isLoadingDecline}
          onAccept={onAccept}
          onDecline={onDecline}
          style={styles.buttonContainer}
        />
      </View>
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    wrapper: {
      backgroundColor: colors.white,
    },
    container: {
      backgroundColor: colors.gray1,
      borderRadius: spacing.borderRadius.large,
      padding: spacing.padding.base,
      marginHorizontal: spacing.margin.large,
      marginBottom: spacing.margin.large,
    },
    content: {
      flexDirection: 'row',
    },
    text: {
      flex: 1,
      marginLeft: spacing.margin.base,
    },
    time: {
      marginTop: spacing.margin.tiny,
    },
    buttonContainer: {
      paddingTop: spacing.padding.base,
    },
  });
};

export default InvitationView;
