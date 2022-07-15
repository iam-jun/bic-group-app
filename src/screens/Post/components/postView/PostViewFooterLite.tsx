import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

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
  const theme: ExtendedTheme = useTheme();
  const {colors} = theme;

  if (commentsCount <= 0) {
    return null;
  }

  return (
    <View testID={'post_view_footer_lite'} style={styles.container}>
      <Text.BodyS color={colors.gray50}>
        {`${commentsCount} ${t(
          commentsCount > 1 ? 'post:label_comments' : 'post:label_comment',
        )}`}
      </Text.BodyS>
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
