import Clipboard from '@react-native-clipboard/clipboard';
import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import {useBaseHook} from '~/hooks';
import {useRootNavigation} from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import postActions from '~/screens/Post/redux/actions';
import * as modalActions from '~/store/modal/actions';
import {showHideToastMessage} from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';
import {getLink, LINK_POST} from '~/utils/link';

export interface PostViewMenuProps {
  postId: string;
  isPostDetail: boolean;
  isActor: boolean;
  isDraftPost?: boolean;
}

const PostViewMenu: FC<PostViewMenuProps> = ({
  postId,
  isPostDetail,
  isActor,
  isDraftPost,
}: PostViewMenuProps) => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const onPress = () => {
    dispatch(modalActions.hideModal());
    dispatch(modalActions.showAlertNewFeature());
  };

  const onPressDelete = () => {
    dispatch(modalActions.hideModal());
    dispatch(
      modalActions.showAlert({
        title: t('post:title_delete_post'),
        content: t('post:content_delete_post'),
        iconName: 'TrashCan',
        cancelBtn: true,
        confirmLabel: t('common:btn_delete'),
        onConfirm: () =>
          dispatch(postActions.deletePost({id: postId, isDraftPost})),
      }),
    );
  };

  const onPressEditSettings = () => {
    dispatch(modalActions.hideModal());
    rootNavigation.navigate(homeStack.postSettings, {postId});
  };

  const onPressEdit = () => {
    dispatch(modalActions.hideModal());
    rootNavigation.navigate(homeStack.createPost, {
      postId,
      replaceWithDetail: !isPostDetail,
    });
  };

  const onPressCopyLink = () => {
    dispatch(modalActions.hideModal());
    Clipboard.setString(getLink(LINK_POST, postId));
    dispatch(
      showHideToastMessage({
        content: 'common:text_link_copied_to_clipboard',
        props: {
          textProps: {useI18n: true},
          type: 'success',
        },
      }),
    );
  };

  return (
    <View style={styles.container}>
      {isActor && (
        <PrimaryItem
          testID={'post_view_menu.edit'}
          style={styles.item}
          leftIcon={'edit'}
          leftIconProps={{icon: 'edit', size: 24}}
          title={t('post:post_menu_edit')}
          onPress={onPressEdit}
        />
      )}
      {isActor && (
        <PrimaryItem
          testID={'post_view_menu.edit_settings'}
          style={styles.item}
          leftIcon={'SlidersUp'}
          leftIconProps={{icon: 'SlidersUp', size: 24}}
          title={t('post:post_menu_edit_settings')}
          onPress={onPressEditSettings}
        />
      )}
      <PrimaryItem
        testID={'post_view_menu.copy'}
        style={styles.item}
        leftIcon={'Copy'}
        leftIconProps={{icon: 'Copy', size: 24}}
        title={t('post:post_menu_copy')}
        onPress={onPressCopyLink}
      />
      <PrimaryItem
        testID={'post_view_menu.bookmark'}
        style={styles.item}
        leftIcon={'Bookmark'}
        leftIconProps={{icon: 'Bookmark', size: 24}}
        title={t('post:post_menu_save')}
        onPress={onPress}
      />
      <PrimaryItem
        testID={'post_view_menu.insights'}
        style={styles.item}
        leftIcon={'GaugeHigh'}
        leftIconProps={{icon: 'GaugeHigh', size: 24}}
        title={t('post:post_menu_view_insights')}
        onPress={onPress}
      />
      <PrimaryItem
        testID={'post_view_menu.noti'}
        style={styles.item}
        leftIcon={'Bell'}
        leftIconProps={{icon: 'Bell', size: 24}}
        title={t('post:post_menu_turn_off_noti')}
        onPress={onPress}
      />
      <PrimaryItem
        testID={'post_view_menu.history'}
        style={styles.item}
        leftIcon={'RotateRight'}
        leftIconProps={{icon: 'RotateRight', size: 24}}
        title={t('post:post_menu_history')}
        onPress={onPress}
      />
      {isActor && (
        <PrimaryItem
          testID={'post_view_menu.delete'}
          style={styles.item}
          leftIcon={'TrashCan'}
          leftIconProps={{icon: 'TrashCan', size: 24}}
          title={t('post:post_menu_delete')}
          onPress={onPressDelete}
        />
      )}
      {!isActor && (
        <PrimaryItem
          testID={'post_view_menu.report'}
          style={styles.item}
          leftIcon={'CircleInfo'}
          leftIconProps={{icon: 'CircleInfo', size: 24}}
          title={t('post:post_menu_report')}
          onPress={onPress}
        />
      )}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {},
    item: {
      height: 44,
      paddingHorizontal: spacing.padding.large,
    },
  });
};

export default PostViewMenu;
