import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import {useBaseHook} from '~/hooks';
import spacing from '~/theme/spacing';

export interface PostViewFooterLiteProps {
  style?: StyleProp<ViewStyle>;
  commentsCount: number;
}

const PostViewFooterLite: FC<PostViewFooterLiteProps> = ({
  style,
  commentsCount,
}: PostViewFooterLiteProps) => {
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors} = theme;

  if (commentsCount <= 0) {
    return null;
  }

  return (
    <View testID={'post_view_footer_lite'} style={styles.container}>
      <Text.Subtitle color={colors.textSecondary}>
        {`${commentsCount} ${t(
          commentsCount > 1 ? 'post:label_comments' : 'post:label_comment',
        )}`}
      </Text.Subtitle>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.padding.base,
    paddingHorizontal: spacing.padding.base,
  },
});

export default PostViewFooterLite;
