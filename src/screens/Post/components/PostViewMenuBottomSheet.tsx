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

export interface PostViewMenuBottomSheetProps {
  modalizeRef: any;
  postId: string;
  isActor: boolean;
}

const PostViewMenuBottomSheet: FC<PostViewMenuBottomSheetProps> = ({
  modalizeRef,
  postId,
  isActor,
}: PostViewMenuBottomSheetProps) => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const insets = useSafeAreaInsets();
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme, insets);

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
        <PrimaryItem
          style={styles.item}
          leftIcon={'Edit'}
          leftIconProps={{icon: 'Edit', size: 24}}
          title={'Edit Post'}
        />
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
            onPress={() => dispatch(postActions.deletePost(postId))}
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
