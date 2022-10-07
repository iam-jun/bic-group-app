import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import Avatar from '~/baseComponents/Avatar';
import Icon from '~/baseComponents/Icon';
import { IPostAudience } from '~/interfaces/IPost';
import { useBaseHook } from '~/hooks';
import TimeView from '~/beinComponents/TimeView';
import { useKeySelector } from '~/hooks/selector';
import spacing from '~/theme/spacing';
import { useRootNavigation } from '~/hooks/navigation';
import mainTabStack from '~/router/navigator/MainStack/stack';
import { Button } from '~/baseComponents';

export interface ContentHeaderProps {
  time?: any;
  actor: any;
  audience?: IPostAudience;
  disabled?: boolean;

  onPressHeader?: () => void;
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
      testID="post_view_header"
      style={styles.headerContainer}
      disabled={disabled || !onPressHeader}
      onPress={onPressHeader}
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
          <Text.H5 numberOfLines={1} testID="post_view_header.actor">
            {actorName}
          </Text.H5>
        </Button>
        <View style={styles.textToAudience}>
          <Text.H6 useI18n style={styles.textTo}>
            post:to
          </Text.H6>
          <Text.H5
            testID="post_view_header.audiences"
            onPress={!isInternetReachable ? undefined : onPressShowAudiences}
          >
            {textAudiences}
          </Text.H5>
        </View>
        <View style={styles.rowCenter}>
          <TimeView
            textProps={{ variant: 'bodyXS', color: colors.neutral40 }}
            time={time}
          />
        </View>
      </View>
      {!!onPressMenu && (
        <View style={{ marginRight: spacing.margin.small }}>
          <Icon
            style={{ alignSelf: 'auto' }}
            icon="menu"
            testID="post_view_header.menu"
            onPress={onPressMenu}
          />
        </View>
      )}
    </Button>
  );
};

const getAudiencesText = (
  aud?: IPostAudience, t?: any,
) => {
  const limitLength = 25;
  let result = '';
  const { groups = [], users = [] } = aud || {};
  const total = groups.length + users.length;
  result = groups?.[0]?.name || users?.[0]?.fullname || '';
  const left = total - 1;
  if (result?.length > limitLength) {
    result = `${result.substr(
      0, limitLength,
    )}...`;
  } else if (left > 0) {
    result = `${result},...`;
  }
  if (left > 0) {
    result = `${result} +${left} ${t?.('post:other_places')}`;
  }
  return result;
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
  },
});

export default ContentHeader;
