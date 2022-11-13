import React, { FC } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import Text from '~/beinComponents/Text';
import Avatar from '~/baseComponents/Avatar';
import { IPostAudience } from '~/interfaces/IPost';
import { useBaseHook } from '~/hooks';
import TimeView from '~/beinComponents/TimeView';
import { useKeySelector } from '~/hooks/selector';
import PostAudiencesModal from '~/components/posts/PostAudiencesModal';
import modalActions from '~/storeRedux/modal/actions';
import spacing from '~/theme/spacing';
import { useRootNavigation } from '~/hooks/navigation';
import mainTabStack from '~/router/navigator/MainStack/stack';
import { Button } from '~/baseComponents';
import { getAudiencesText } from '~/helpers/post';

export interface ContentHeaderProps {
  style?: StyleProp<ViewStyle>;

  createdAt?: any;
  actor: any;
  audience?: IPostAudience;
  disabled?: boolean;

  onPressHeader?: (id?: string) => void;
  onPressMenu?: (e: any) => void;
  onPressShowAudiences?: () => void;
}

const ContentHeader: FC<ContentHeaderProps> = ({
  style,

  createdAt,
  actor,
  audience,
  disabled = false,

  onPressHeader,
  onPressMenu,
  onPressShowAudiences,
}: ContentHeaderProps) => {
  const dispatch = useDispatch();
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

  const onPressAudience = () => {
    if (!isInternetReachable) {
      return;
    }

    if (onPressShowAudiences) {
      onPressShowAudiences();
    } else {
      dispatch(
        modalActions.showModal({
          isOpen: true,
          isFullScreen: true,
          titleFullScreen: t('post:title_post_to'),
          ContentComponent: <PostAudiencesModal data={audience?.groups || []} />,
        }),
      );
    }
  };

  return (
    <Button
      testID="content_header"
      style={[styles.headerContainer, style]}
      disabled={disabled || !onPressHeader}
      onPress={() => onPressHeader()}
      activeOpacity={1}
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
          <Text.SubtitleM
            color={colors.neutral80}
            numberOfLines={1}
            testID="content_header.actor"
          >
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
            onPress={onPressAudience}
          >
            {textAudiences}
          </Text.SubtitleM>
        </View>
        <View style={styles.rowCenter}>
          <TimeView
            textProps={{ variant: 'bodyXS', color: colors.neutral40 }}
            time={createdAt}
          />
        </View>
      </View>
      {onPressMenu && (
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
    marginHorizontal: spacing.margin.large,
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
    marginRight: spacing.margin.base,
  },
  btnActor: {
    alignSelf: 'flex-start',
    marginRight: spacing.margin.base,
  },
  iconMenu: {
  },
});

export default ContentHeader;
