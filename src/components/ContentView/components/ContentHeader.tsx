import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import Avatar from '~/baseComponents/Avatar';
import { IPostAudience } from '~/interfaces/IPost';
import { useBaseHook } from '~/hooks';
import TimeView from '~/beinComponents/TimeView';
import { useKeySelector } from '~/hooks/selector';
import spacing from '~/theme/spacing';
import { useRootNavigation } from '~/hooks/navigation';
import { getAudiencesText } from '~/screens/post/components/PostViewComponents/helper';
import mainTabStack from '~/router/navigator/MainStack/stack';
import { Button } from '~/baseComponents';

export interface ContentHeaderProps {
  time?: any;
  actor: any;
  audience?: IPostAudience;
  disabled?: boolean;

  onPressHeader?: (id?: string) => void;
  onPressMenu?: (e: any) => void;
  onPressShowAudiences?: () => void;
}

const ContentHeader: FC<ContentHeaderProps> = ({
  time,
  actor,
  audience,
  disabled = false,

  onPressHeader,
  onPressMenu,
  onPressShowAudiences,
}: ContentHeaderProps) => {
  const { t } = useBaseHook();
  const { colors } = useTheme();
  const { rootNavigation } = useRootNavigation();

  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const textAudiences = getAudiencesText(audience, t);

  const avatar = actor?.avatar;
  const actorName = actor?.fullname;

  const onPressActor = () => {
    if (!actor.id) return;

    const payload = { userId: actor.id };
    rootNavigation.navigate(
      mainTabStack.userProfile, payload,
    );
  };

  return (
    <Button
      testID="content_header"
      style={styles.headerContainer}
      disabled={disabled || !onPressHeader}
      onPress={() => onPressHeader()}
    >
      <Button
        style={styles.avatar}
        onPress={onPressActor}
      >
        <Avatar.Medium isRounded source={avatar} />
      </Button>
      <View style={styles.flex1}>
        <Button
          style={styles.btnActor}
          onPress={onPressActor}
        >
          <Text.SubtitleM color={colors.neutral80} numberOfLines={1} testID="content_header.actor">
            {actorName}
          </Text.SubtitleM>
        </Button>
        <View style={styles.textToAudience}>
          <Text.BodyM color={colors.neutral40} useI18n style={styles.textTo}>
            post:to
          </Text.BodyM>
          <Text.SubtitleM
            testID="content_header.audiences"
            color={colors.neutral80}
            onPress={!isInternetReachable ? undefined : onPressShowAudiences}
          >
            {textAudiences}
          </Text.SubtitleM>
        </View>
        <View style={styles.rowCenter}>
          <TimeView
            textProps={{ variant: 'bodyXS', color: colors.neutral40 }}
            time={time}
          />
        </View>
      </View>
      {!!onPressMenu && (
        <View style={styles.iconMenu}>
          <Button.Raise
            icon="menu"
            size="small"
            testID="content_header.menu"
            onPress={onPressMenu}
          />
        </View>
      )}
    </Button>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    paddingTop: spacing?.margin.small,
  },
  flex1: { flex: 1 },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  textToAudience: {
    flexDirection: 'row',
    marginVertical: spacing.margin.tiny,
    alignItems: 'center',
  },
  textTo: {
    marginRight: spacing?.margin.tiny,
  },
  avatar: {
    marginTop: spacing.margin.tiny,
    marginLeft: spacing.margin.large,
    marginRight: spacing.margin.base,
  },
  btnActor: {
    alignSelf: 'flex-start',
    marginRight: spacing.margin.base,
  },
  iconMenu: {
    marginRight: spacing.margin.large,
  },
});

export default ContentHeader;
