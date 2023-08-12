import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React from 'react';
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

interface Props {
id: string;
}

const InvitationItem = ({ id }: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);
  const { rootNavigation } = useRootNavigation();

  const data: IInvitation = useMyInvitationsStore((state) => state.invitationData?.[id]);
  const {
    inviter, targetInfo, targetType,
  } = data || {};

  const { fullname, avatar, isDeactivated } = inviter || {};
  const { name } = targetInfo || {};

  const onPressTarget = () => {
    if (!targetType) return;
  };

  const onPressActor = () => {
    if (!inviter.id || inviter?.isDeactivated) return;

    const payload = { userId: inviter.id };
    rootNavigation.navigate(
      mainTabStack.userProfile, payload,
    );
  };

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
              color={colors.neutral60}
              testID="invitation_item.inviter"
            >
              {fullname}
            </Text.SubtitleM>
          </Button>
          {isDeactivated && <DeactivatedView style={styles.deactivatedView} />}
          <Text.BodyM useI18n>
            user:text_invited_to_join
          </Text.BodyM>
          <Button onPress={onPressTarget}>
            <Text.SubtitleM
              color={colors.neutral60}
              testID="invitation_item.target_name"
            >
              {name}
            </Text.SubtitleM>
          </Button>
        </View>
        <ViewSpacing height={spacing.margin.large} />
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
