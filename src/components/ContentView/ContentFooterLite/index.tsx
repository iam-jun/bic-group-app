import React, { FC } from 'react';
import {
  View, StyleSheet,
} from 'react-native';

import Text from '~/baseComponents/Text';
import { useBaseHook } from '~/hooks';
import spacing from '~/theme/spacing';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import ContentInterestedUserCount from '../ContentInterestedUserCount';

export interface ContentFooterLiteProps {
  id: string;
  reactionsCount: number;
  commentsCount: number;
  totalUsersSeen: number;

  onPressComment?: () => void;

}

const ContentFooterLite: FC<ContentFooterLiteProps> = ({
  id,
  totalUsersSeen,
  reactionsCount = 0,
  commentsCount = 0,

  onPressComment,
}: ContentFooterLiteProps) => {
  const { t } = useBaseHook();

  return (
    <View testID="content_footer_lite" style={styles.container}>
      <View style={styles.row}>
        <Text.BodyS>
          {`${reactionsCount} ${t('post:button_react')}`}
        </Text.BodyS>
        <ViewSpacing width={spacing.margin.large} />
        <Text.BodyS testID="content_footer_lite.comment_text" onPress={onPressComment}>
          {`${commentsCount} ${t(commentsCount > 1 ? 'post:label_comments' : 'post:label_comment')}`}
        </Text.BodyS>
      </View>
      <ContentInterestedUserCount
        id={id}
        interestedUserCount={totalUsersSeen}
        style={styles.seenCountsViewAtBottom}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.padding.small,
    paddingHorizontal: spacing.padding.large,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seenCountsViewAtBottom: {
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
});

export default ContentFooterLite;
