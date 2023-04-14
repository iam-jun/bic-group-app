import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import MarkdownView from '~/beinComponents/MarkdownView';
import TimeView from '~/beinComponents/TimeView';
import spacing from '~/theme/spacing';

interface Props {
  description: string;
  content: string;
  updatedAt: string;

}

const NotificationContent = ({
  description,
  content,
  updatedAt,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;

  return (
    <View testID="notification_content" style={styles.container}>
      <MarkdownView testID="notification_content.description">
        {description}
      </MarkdownView>
      {!!content && (
        <MarkdownView
          testID="notification_content.content"
        >
          {content}
        </MarkdownView>
      )}
      <TimeView
        testID="notification_content.time_view"
        time={updatedAt}
        style={styles.timeCreated}
        type="short"
        textProps={{ variant: 'bodyS', color: colors.neutral40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timeCreated: {
    marginTop: spacing.margin.tiny,
  },
});

export default NotificationContent;
