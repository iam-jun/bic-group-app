import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { useDispatch } from 'react-redux';
import { useRootNavigation } from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';

import { useKeySelector } from '~/hooks/selector';
import modalActions from '~/storeRedux/modal/actions';

import BannerImportant from '~/baseComponents/BannerImportant';
import PostAudiencesModal from '~/components/posts/PostAudiencesModal';
import Icon from '~/baseComponents/Icon';
import { isPostExpired } from '~/helpers/post';
import spacing from '~/theme/spacing';
import { IPostCommunities } from '~/interfaces/IPost';
import { useBaseHook } from '~/hooks';

export interface PostImportantProps {
  isImportant: boolean;
  expireTime: any;
  markedReadPost: boolean;
  isLite?: boolean;
  listCommunity?: IPostCommunities[];
}

const PostImportant: FC<PostImportantProps> = ({
  isImportant,
  expireTime,
  markedReadPost,
  isLite,
  listCommunity,
}: PostImportantProps) => {
  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const { colors } = theme || {};
  const isExpired = isPostExpired(expireTime);

  if (isLite) {
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
    rootNavigation.navigate(mainStack.communityDetail, { communityId });
  };

  const _onPressBanner = () => {
    if (!isInternetReachable) {
      return;
    }

    dispatch(modalActions.showModal({
      isOpen: true,
      isFullScreen: true,
      titleFullScreen: t('post:title_post_to'),
      ContentComponent: <PostAudiencesModal
        data={listCommunity || []}
        onPressItemAudience={goToCommunity}
      />,
    }));
  };

  return (
    <BannerImportant
      markedAsRead={markedReadPost}
      isExpired={isExpired}
      isImportant={isImportant}
      listCommunity={listCommunity}
      onPressBanner={_onPressBanner}
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
