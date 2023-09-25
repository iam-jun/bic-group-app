import React, { FC, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import ContentItem from '~/components/ContentItem';
import usePostsStore from '~/store/entities/posts';
import postsSelector from '~/store/entities/posts/selectors';
import { BoxScheduleTime } from '~/components/ScheduleContent';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { spacing } from '~/theme';

type ScheduledItemProps = {
    idContent: string;
};

const ScheduledItem: FC<ScheduledItemProps> = ({ idContent }) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const data = usePostsStore(useCallback(postsSelector.getPost(idContent, {}), [idContent]));

  const {
    scheduledAt,
    status,
    deleted,
  } = data;

  return (
    <View>
      <ContentItem id={idContent} />
      {
        !deleted && (
        <>
          <View style={styles.viewSpacingContainer}>
            <ViewSpacing height={spacing.margin.small} />
            <View style={styles.line} />
            <ViewSpacing height={spacing.margin.small} />
          </View>
          <BoxScheduleTime
            scheduledAt={scheduledAt}
            status={status}
            isBorderBottomShadow
          />
        </>
        )
      }
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    viewSpacingContainer: {
      backgroundColor: colors.white,
    },
    line: {
      borderTopColor: colors.neutral5,
      borderTopWidth: 1,
    },
  });
};

export default ScheduledItem;
