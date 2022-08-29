import React, { FC, ReactElement } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';
import ViewSpacing from '~/beinComponents/ViewSpacing';

export interface PostViewFooterLiteProps {
  reactionsCount: number;
  commentsCount: number;
  seenCountsViewComponent: ReactElement;
}

const PostViewFooterLite: FC<PostViewFooterLiteProps> = ({
  reactionsCount = 0,
  commentsCount = 0,
  seenCountsViewComponent,
}: PostViewFooterLiteProps) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  // if (commentsCount <= 0) {
  //   return null;
  // }

  return (
    <View testID="post_view_footer_lite" style={styles.container}>
      <View style={styles.row}>
        <Text.BodyS>
          {`${reactionsCount} ${t(reactionsCount > 1 ? 'post:button_react' : 'post:button_react')}`}
        </Text.BodyS>
        <ViewSpacing width={spacing.margin.large} />
        <Text.BodyS>
          {`${commentsCount} ${t(commentsCount > 1 ? 'post:label_comments' : 'post:label_comment')}`}
        </Text.BodyS>
      </View>
      {seenCountsViewComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.padding.small,
    paddingHorizontal: spacing.padding.large,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PostViewFooterLite;
