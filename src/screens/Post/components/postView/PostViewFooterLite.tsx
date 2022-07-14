import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import {IReactionCounts} from '~/interfaces/IPost';
import {useBaseHook} from '~/hooks';

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
  const styles = createStyle(theme);

  if (commentsCount <= 0) {
    return null;
  }

  return (
    <View testID={'post_view_footer_lite'} style={styles.container}>
      <Text.BodyS color={colors.textSecondary}>
        {`${commentsCount} ${t(
          commentsCount > 1 ? 'post:label_comments' : 'post:label_comment',
        )}`}
      </Text.BodyS>
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
