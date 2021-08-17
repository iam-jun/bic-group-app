import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import BottomSheet from '~/beinComponents/BottomSheet';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useBaseHook} from '~/hooks';
import {useDispatch} from 'react-redux';
import postActions from '~/screens/Post/redux/actions';
import * as modalActions from '~/store/modal/actions';
import {useRootNavigation} from '~/hooks/navigation';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';

export interface PostViewMenuBottomSheetProps {
  modalizeRef: any;
  postId: string;
  isPostDetail: boolean;
  isActor: boolean;
}

const PostViewMenuBottomSheet: FC<PostViewMenuBottomSheetProps> = ({
  modalizeRef,
  postId,
  isPostDetail,
  isActor,
}: PostViewMenuBottomSheetProps) => {
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const {t} = useBaseHook();
  const insets = useSafeAreaInsets();
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme, insets);

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

  const renderContent = () => {
    return (
      <View style={styles.container}>
        <PrimaryItem
          style={styles.item}
          leftIcon={'TachometerFastAlt'}
          leftIconProps={{icon: 'TachometerFastAlt', size: 24}}
          title={'View Post Statistics'}
        />
        <PrimaryItem
          style={styles.item}
          leftIcon={'Bookmark'}
          leftIconProps={{icon: 'Bookmark', size: 24}}
          title={'Save Post'}
        />
        <PrimaryItem
          style={styles.item}
          leftIcon={'Copy'}
          leftIconProps={{icon: 'Copy', size: 24}}
          title={'Copy Post Link'}
        />
        <PrimaryItem
          style={styles.item}
          leftIcon={'Bell'}
          leftIconProps={{icon: 'Bell', size: 24}}
          title={'Turn off notification for this post'}
        />
        {isActor && (
          <PrimaryItem
            style={styles.item}
            leftIcon={'Edit'}
            leftIconProps={{icon: 'Edit', size: 24}}
            title={'Edit Post'}
            onPress={onPressEdit}
          />
        )}
        <PrimaryItem
          style={styles.item}
          leftIcon={'Redo'}
          leftIconProps={{icon: 'Redo', size: 24}}
          title={'View Edit History'}
        />
        {isActor && (
          <PrimaryItem
            style={styles.item}
            leftIcon={'TrashAlt'}
            leftIconProps={{icon: 'TrashAlt', size: 24}}
            title={t('post:label_menu_delete')}
            onPress={onPressDelete}
          />
        )}
      </View>
    );
  };

  return (
    <BottomSheet modalizeRef={modalizeRef} ContentComponent={renderContent()} />
  );
};

const createStyle = (theme: ITheme, insets: any) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingHorizontal: spacing.padding.large,
      paddingBottom: spacing.padding.base + insets.bottom,
    },
    item: {height: 44},
  });
};

export default PostViewMenuBottomSheet;
