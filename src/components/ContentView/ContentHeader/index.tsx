import React, { FC } from 'react';
import {
  View, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';
import { useTheme } from '@react-navigation/native';

import Text from '~/baseComponents/Text';
import Avatar from '~/baseComponents/Avatar';
import { IPostAudience } from '~/interfaces/IPost';
import { useBaseHook } from '~/hooks';
import TimeView from '~/beinComponents/TimeView';
import PostAudiencesModal from '~/components/posts/PostAudiencesModal';
import useNetworkStore from '~/store/network';
import networkSelectors from '~/store/network/selectors';
import spacing from '~/theme/spacing';
import { useRootNavigation } from '~/hooks/navigation';
import mainTabStack from '~/router/navigator/MainStack/stack';
import { Button } from '~/baseComponents';
import { getAudiencesText } from '~/helpers/post';
import Icon from '~/baseComponents/Icon';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import useModalStore from '~/store/modal';
import DeactivatedView from '~/components/DeactivatedView';

export interface ContentHeaderProps {
  style?: StyleProp<ViewStyle>;

  createdAt?: any;
  actor: any;
  audience?: IPostAudience;
  disabled?: boolean;
  postId?: string;

  onPressHeader?: () => void;
  onPressMenu?: (e: any) => void;
  onPressShowAudiences?: () => void;
}

const ContentHeader: FC<ContentHeaderProps> = ({
  style,

  createdAt,
  actor,
  audience,
  disabled = false,
  postId,

  onPressHeader,
  onPressMenu,
  onPressShowAudiences,
}: ContentHeaderProps) => {
  const { t } = useBaseHook();
  const { colors } = useTheme();
  const { rootNavigation } = useRootNavigation();

  const isInternetReachable = useNetworkStore(networkSelectors.getIsInternetReachable);
  const isHidden = usePostsStore(postsSelector.getIsHidden(postId));
  const modalActions = useModalStore((state) => state.actions);

  const textAudiences = getAudiencesText(audience, t);

  const { avatar, fullname: actorName, isDeactivated } = actor || {};

  const onPressActor = () => {
    if (!actor.id || isDeactivated) return;

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
      modalActions.showModal({
        isOpen: true,
        isFullScreen: true,
        titleFullScreen: t('post:title_published_to'),
        ContentComponent: (
          <PostAudiencesModal
            data={audience?.groups || []}
            showBlockedIcon={isHidden}
          />
        ),
      });
    }
  };

  const renderIconReportContent = () => {
    if (isHidden) {
      return (
        <>
          <Icon icon="iconCircleExclamation" size={14} tintColor={colors.neutral40} />
          {' '}
        </>
      );
    }
    return null;
  };

  const colorActorName = isDeactivated ? colors.grey40 : colors.neutral80;

  return (
    <Button
      testID="content_header"
      style={[styles.headerContainer, style]}
      disabled={disabled || !onPressHeader}
      onPress={onPressHeader}
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
            style={styles.actorName}
            color={colorActorName}
            numberOfLines={1}
            testID="content_header.actor"
          >
            {actorName}
          </Text.SubtitleM>
          {isDeactivated && <DeactivatedView style={styles.deactivatedView} />}
        </Button>
        <View style={styles.textToAudience}>
          <Text.BodyS color={colors.neutral40} useI18n style={styles.textTo}>
            post:to
          </Text.BodyS>
          <Text.SubtitleS
            testID="content_header.audiences"
            color={colors.neutral80}
            onPress={onPressAudience}
          >
            {renderIconReportContent()}
            {textAudiences}
          </Text.SubtitleS>
        </View>
        <View style={styles.rowCenter}>
          <TimeView
            textProps={{ variant: 'bodyXS', color: colors.neutral40 }}
            time={createdAt}
          />
        </View>
      </View>
      {onPressMenu && (
        <View>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.margin.base,
  },
  actorName: {
    flexShrink: 1,
  },
  deactivatedView: {
    marginLeft: spacing.margin.tiny,
  },
});

export default ContentHeader;
