import React, {FC, useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import postActions from '~/screens/Post/redux/actions';
import {useDispatch} from 'react-redux';

export interface LoadMoreCommentProps {
  title: string;
  postId: string;
  idLessThan: string;
}

const LoadMoreComment: FC<LoadMoreCommentProps> = ({
  title,
  postId,
  idLessThan,
}: LoadMoreCommentProps) => {
  const [loadingMore, setLoadingMore] = useState(false);

  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const onPressLoadMore = () => {
    if (idLessThan) {
      dispatch(
        postActions.getCommentsByPostId({
          postId: postId,
          id_lt: idLessThan,
          isMerge: true,
          callbackLoading: loading => setLoadingMore(loading),
        }),
      );
    }
  };

  return (
    <View style={styles.container}>
      <Button onPress={onPressLoadMore}>
        <Text.H6 style={styles.textLoadMoreComment} useI18n>
          {title}
        </Text.H6>
      </Button>
      <ActivityIndicator color={colors.disabled} animating={loadingMore} />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textLoadMoreComment: {
      margin: spacing.margin.small,
      color: colors.primary7,
    },
  });
};

export default LoadMoreComment;
