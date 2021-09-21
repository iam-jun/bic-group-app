import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import BottomSheet from '~/beinComponents/BottomSheet';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import {useBaseHook} from '~/hooks';
import {useDispatch} from 'react-redux';
import postActions from '~/screens/Post/redux/actions';
import * as modalActions from '~/store/modal/actions';
import {useRootNavigation} from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import {showHideToastMessage} from '~/store/modal/actions';

export interface PostViewMenuBottomSheetProps {
  modalizeRef: any;
  postId: string;
  content: string;
  isPostDetail: boolean;
  isActor: boolean;
}

const PostViewMenuBottomSheet: FC<PostViewMenuBottomSheetProps> = ({
  modalizeRef,
  postId,
  content,
  isPostDetail,
  isActor,
}: PostViewMenuBottomSheetProps) => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const onPress = () => {
    modalizeRef?.current?.close?.();
    dispatch(modalActions.showAlertNewFeature());
  };

  const onPressDelete = () => {
    modalizeRef?.current?.close?.();
    dispatch(
      modalActions.showAlert({
        title: t('post:title_delete_post'),
        content: t('post:content_delete_post'),
        iconName: 'Trash',
        cancelBtn: true,
        confirmLabel: t('common:btn_delete'),
        onConfirm: () => dispatch(postActions.deletePost(postId)),
      }),
    );
  };

  const onPressEdit = () => {
    modalizeRef?.current?.close?.();
    rootNavigation.navigate(homeStack.createPost, {
      postId,
      replaceWithDetail: !isPostDetail,
    });
  };

  const onPressCopy = () => {
    modalizeRef?.current?.close?.();
    if (content) {
      Clipboard.setString(content);
      dispatch(
        showHideToastMessage({
          content: 'common:text_copied_to_clipboard',
          props: {
            textProps: {useI18n: true},
            type: 'success',
          },
        }),
      );
    }
  };

  const renderContent = () => {
    return (
      <View style={styles.container}>
        {isActor && (
          <PrimaryItem
            style={styles.item}
            leftIcon={'Edit'}
            leftIconProps={{icon: 'Edit', size: 24}}
            title={t('post:post_menu_edit')}
            onPress={onPressEdit}
          />
        )}
        <PrimaryItem
          style={styles.item}
          leftIcon={'Copy'}
          leftIconProps={{icon: 'Copy', size: 24}}
          title={t('post:post_menu_copy')}
          onPress={onPressCopy}
        />
        <PrimaryItem
          style={styles.item}
          leftIcon={'Bookmark'}
          leftIconProps={{icon: 'Bookmark', size: 24}}
          title={t('post:post_menu_save')}
          onPress={onPress}
        />
        <PrimaryItem
          style={styles.item}
          leftIcon={'TachometerFastAlt'}
          leftIconProps={{icon: 'TachometerFastAlt', size: 24}}
          title={t('post:post_menu_view_insights')}
          onPress={onPress}
        />
        <PrimaryItem
          style={styles.item}
          leftIcon={'Bell'}
          leftIconProps={{icon: 'Bell', size: 24}}
          title={t('post:post_menu_turn_off_noti')}
          onPress={onPress}
        />
        <PrimaryItem
          style={styles.item}
          leftIcon={'Redo'}
          leftIconProps={{icon: 'Redo', size: 24}}
          title={t('post:post_menu_history')}
          onPress={onPress}
        />
        {isActor && (
          <PrimaryItem
            style={styles.item}
            leftIcon={'TrashAlt'}
            leftIconProps={{icon: 'TrashAlt', size: 24}}
            title={t('post:post_menu_delete')}
            onPress={onPressDelete}
          />
        )}
        {!isActor && (
          <PrimaryItem
            style={styles.item}
            leftIcon={'InfoCircle'}
            leftIconProps={{icon: 'InfoCircle', size: 24}}
            title={t('post:post_menu_report')}
            onPress={onPress}
          />
        )}
      </View>
    );
  };

  return (
    <BottomSheet modalizeRef={modalizeRef} ContentComponent={renderContent()} />
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

export default PostViewMenuBottomSheet;
