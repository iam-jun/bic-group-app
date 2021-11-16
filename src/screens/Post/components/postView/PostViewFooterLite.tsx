import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import {IReactionCounts} from '~/interfaces/IPost';
import {useBaseHook} from '~/hooks';

export interface PostViewFooterLiteProps {
  style?: StyleProp<ViewStyle>;
  reactionCounts: IReactionCounts;
}

const PostViewFooterLite: FC<PostViewFooterLiteProps> = ({
  style,
  reactionCounts,
}: PostViewFooterLiteProps) => {
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const commentCount = reactionCounts?.comment_count || 0;

  if (commentCount <= 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text.Subtitle color={colors.textSecondary}>
        {`${commentCount} ${t(
          commentCount > 1 ? 'post:label_comments' : 'post:label_comment',
        )}`}
      </Text.Subtitle>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingBottom: spacing.padding.base,
      paddingHorizontal: spacing.padding.base,
    },
  });
};

export default PostViewFooterLite;
