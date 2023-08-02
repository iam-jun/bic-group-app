import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import useNetworkStore from '~/store/network';
import networkSelectors from '~/store/network/selectors';

import BannerImportant from '~/baseComponents/BannerImportant';
import PostAudiencesModal from '~/components/posts/PostAudiencesModal';
import Icon from '~/baseComponents/Icon';
import { isPostExpired } from '~/helpers/post';
import spacing from '~/theme/spacing';
import { IPostCommunities } from '~/interfaces/IPost';
import { useBaseHook } from '~/hooks';
import useModalStore from '~/store/modal';
import { navigateToCommunityDetail } from '~/helpers/common';

export interface PostImportantProps {
  isImportant: boolean;
  expireTime: any;
  markedReadPost: boolean;
  isLite?: boolean;
  listCommunity?: IPostCommunities[];
  shouldBeHidden?: boolean;
}

const PostImportant: FC<PostImportantProps> = ({
  isImportant,
  expireTime,
  markedReadPost,
  isLite,
  listCommunity,
  shouldBeHidden,
}: PostImportantProps) => {
  const { t } = useBaseHook();
  const isInternetReachable = useNetworkStore(networkSelectors.getIsInternetReachable);

  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { colors } = theme || {};
  const isExpired = isPostExpired(expireTime);
  const modalActions = useModalStore((state) => state.actions);

  if (isLite && isImportant) {
    return (
      <View
        testID="post_view.important_status_lite"
        style={styles.liteContainer}
      >
        <Icon
          size={12}
          icon="iconStar"
          iconStyle={styles.iconStar}
          tintColor={colors.purple50}
        />
      </View>
    );
  }

  const goToCommunity = ({ communityId }) => {
    navigateToCommunityDetail({ communityId });
  };

  const _onPressBanner = () => {
    if (!isInternetReachable) {
      return;
    }

    modalActions.showModal({
      isOpen: true,
      isFullScreen: true,
      titleFullScreen: t('post:title_publish_to'),
      ContentComponent: <PostAudiencesModal
        data={listCommunity || []}
        onPressItemAudience={goToCommunity}
      />,
    });
  };

  return (
    <BannerImportant
      markedAsRead={markedReadPost}
      isExpired={isExpired}
      isImportant={isImportant}
      listCommunity={listCommunity}
      onPressBanner={_onPressBanner}
      shouldBeHidden={shouldBeHidden}
    />
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    liteContainer: {
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 1,
      backgroundColor: colors.purple50,
      paddingHorizontal: spacing.padding.tiny,
      paddingTop: spacing.padding.small,
      paddingBottom: spacing.padding.tiny,
      borderBottomRightRadius: 8,
      borderBottomLeftRadius: 8,
    },
    iconStar: {
      backgroundColor: colors.white,
      borderRadius: spacing.borderRadius.small,
      padding: 2,
    },
  });
};

export default PostImportant;
