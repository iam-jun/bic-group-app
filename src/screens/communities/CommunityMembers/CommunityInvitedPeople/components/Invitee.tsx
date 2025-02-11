import React, { useContext, useState } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { t } from 'i18next';
import { spacing } from '~/theme';
import { IInvitedPeople } from '~/interfaces/IGroup';
import images from '~/resources/images';
import { Avatar, Button } from '~/baseComponents';
import Text from '~/baseComponents/Text';
import { formatLongTime } from '~/beinComponents/TimeView/helper';
import { AppContext } from '~/contexts/AppContext';
import useGroupJoinableUsersStore from '~/components/InvitePeopleToYourGroup/store';
import DeactivatedView from '~/components/DeactivatedView';
import { useRootNavigation } from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';

interface InviteeProps {
  item: IInvitedPeople;
}

const Invitee = ({ item }: InviteeProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const { rootNavigation } = useRootNavigation();

  const { language } = useContext(AppContext);

  const { inviter, invitee, createdAt } = item || {};

  const [isLoading, setIsLoading] = useState(false);

  const cancelInvitation = useGroupJoinableUsersStore((state) => state.actions.cancelInvitation);

  const onCancelInvite = async () => {
    setIsLoading(true);
    await cancelInvitation(item.id);
    setIsLoading(false);
  };

  const onPressInvitee = () => {
    rootNavigation.navigate(mainStack.userProfile, {
      userId: invitee.id,
    });
  };

  const renderTime = () => formatLongTime(createdAt, language);

  const renderInvitee = () => (
    <Text.SubtitleM onPress={onPressInvitee} numberOfLines={2} color={theme.colors.neutral60}>
      {invitee.fullname}
    </Text.SubtitleM>
  );

  const renderInviter = () => {
    if (inviter.isDeactivated) {
      return (
        <View style={styles.inviterContainer}>
          <Text.BodyXS numberOfLines={1} color={theme.colors.neutral40}>
            {t('common:text_invited_by')}
            {' '}
          </Text.BodyXS>
          <View style={styles.deactivatedContainer}>
            <Text.SubtitleXS style={styles.deactivatedName} numberOfLines={1} color={theme.colors.grey40}>
              {inviter.fullname}
            </Text.SubtitleXS>
            <DeactivatedView style={styles.deactivatedView} />
          </View>
          <Text.BodyXS numberOfLines={1} color={theme.colors.neutral40}>
            {' '}
            {renderTime()}
          </Text.BodyXS>
        </View>
      );
    }
    return (
      <View style={styles.inviterContainer}>
        <Text.BodyXS color={theme.colors.neutral40}>
          {t('common:text_invited_by')}
          {' '}
          <Text.SubtitleXS color={theme.colors.neutral40}>{inviter.fullname}</Text.SubtitleXS>
          {' '}
          {renderTime()}
        </Text.BodyXS>
      </View>
    );
  };

  return (
    <View style={styles.container} testID="invitee">
      <TouchableOpacity onPress={onPressInvitee}>
        <Avatar.Small source={invitee.avatar || images.img_user_avatar_default} isRounded />
      </TouchableOpacity>
      <View style={styles.rightContainer}>
        {renderInvitee()}
        {renderInviter()}
        <Button.Neutral style={styles.button} onPress={onCancelInvite} type="ghost" useI18n loading={isLoading}>
          common:button_cancel_invite
        </Button.Neutral>
      </View>
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: spacing.padding.large,
      backgroundColor: colors.white,
    },
    rightContainer: {
      flex: 1,
      marginLeft: spacing.margin.small,
    },
    button: {
      alignSelf: 'flex-start',
      marginTop: spacing.margin.large,
    },
    deactivatedContainer: {
      flexShrink: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    deactivatedName: {
      flexShrink: 1,
    },
    deactivatedView: {
      marginLeft: spacing.margin.small,
    },
    inviterContainer: {
      flexDirection: 'row',
      marginTop: spacing.margin.tiny,
      alignItems: 'center',
    },
  });
};

export default Invitee;
