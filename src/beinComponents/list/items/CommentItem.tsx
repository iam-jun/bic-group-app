import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {IReaction} from '~/interfaces/IPost';
import CommentView from '~/beinFragments/CommentView';

export interface CommentItemProps {
  commentData: IReaction;
}

const CommentItem: React.FC<CommentItemProps> = ({
  commentData,
}: CommentItemProps) => {
  const theme: ITheme = useTheme();
  const styles = createStyle(theme);

  return (
    <View style={styles.container}>
      <CommentView commentData={commentData} />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingTop: spacing?.padding.small,
      paddingBottom: spacing?.padding.base,
      paddingHorizontal: spacing?.padding.large,
      backgroundColor: colors.background,
    },
  });
};

export default CommentItem;
