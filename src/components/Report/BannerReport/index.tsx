import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { spacing } from '~/theme';
import Text from '~/baseComponents/Text';
import Icon from '~/baseComponents/Icon';

import { useBaseHook } from '~/hooks';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import useCommentsStore from '~/store/entities/comments';
import commentsSelector from '~/store/entities/comments/selectors';
import useReportContentStore from '../store';
import { IReportDetail } from '~/interfaces/IReport';
import reportSelector from '../store/selectors';

export interface Props {
  postId?: string;
  commentId?: string;
}

const BannerReport: FC<Props> = ({ postId, commentId }) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { t } = useBaseHook();

  const reportDetailsPost = useReportContentStore(reportSelector.getReportDetailsPost(postId));

  let isReported = null;
  let reportDetails = null;
  if (postId) {
    // Use case Post and Article
    isReported = usePostsStore(postsSelector.getIsReported(postId));
    reportDetails = usePostsStore(postsSelector.getReportDetails(postId)) || reportDetailsPost;
  } else {
    // Use case Comment
    const report = useCommentsStore(commentsSelector.getComment(commentId))?.reportDetails;
    isReported = report?.length > 0;
    reportDetails = report;
  }

  const reportReasons = reportDetails?.map((item: IReportDetail) => item.description).join(', ');

  if (isReported) {
    return (
      <View style={styles.reportContentContainer}>
        <Text.BodyS style={styles.textReportContent}>
          {t('report:banner_report_content')}
          <Text.SubtitleS>{reportReasons}</Text.SubtitleS>
        </Text.BodyS>
        <Icon icon="iconFlagSolid" size={14} tintColor={colors.neutral40} />
      </View>
    );
  }
  return null;
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    reportContentContainer: {
      backgroundColor: colors.neutral10,
      paddingVertical: spacing.padding.small,
      paddingLeft: spacing.padding.large,
      paddingRight: spacing.padding.large + spacing.padding.xSmall,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textReportContent: {
      marginRight: spacing.margin.base + spacing.margin.tiny,
    },
  });
};

export default BannerReport;
