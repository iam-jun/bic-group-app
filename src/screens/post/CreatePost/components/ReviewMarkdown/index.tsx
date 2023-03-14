import { ExtendedTheme, useTheme } from '@react-navigation/native';
import i18next from 'i18next';
import React, { FC } from 'react';
import {
  ScrollView, StyleSheet, useWindowDimensions, View,
} from 'react-native';

import Text from '~/baseComponents/Text';

import { Button } from '~/baseComponents';
import Avatar from '~/baseComponents/Avatar';
import Markdown from '~/beinComponents/Markdown';
import { IAudience } from '~/interfaces/IPost';
import useCommonController from '~/screens/store';
import spacing from '~/theme/spacing';
import useCreatePostStore from '../../store';

export interface ReviewMarkdownProps {
  testID?: string;
  onPressDone: () => void
}

const ReviewMarkdown: FC<ReviewMarkdownProps> = ({ testID, onPressDone }) => {
  const windowDimension = useWindowDimensions();
  const screenHeight = windowDimension.height;

  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(
    theme, screenHeight,
  );
  const content = useCreatePostStore((state) => state.createPost.content);
  const chosenAudiences = useCreatePostStore((state) => state.createPost.chosenAudiences || []);
  const { fullname, avatar } = useCommonController((state) => state.myProfile) || {};

  const renderTitleHeader = () => (
    <View style={styles.header}>
      <Text.H5 useI18n>post:text_review_markdown</Text.H5>
      <Button.Primary
        testID="header.button"
        style={styles.buttonDone}
        onPress={onPressDone}
        useI18n

      >
        common:btn_done
      </Button.Primary>
    </View>
  );

  const renderPost = () => (
    <View style={styles.post}>
      {/* render post header */}
      <View style={styles.postHeader}>
        <Avatar.Medium isRounded source={avatar} style={styles.avatar} />
        <View style={styles.flex1}>
          <Text.H6>{fullname}</Text.H6>
          <View style={styles.audienceLine}>
            <Text.BodySMedium
              useI18n
              color={theme.colors.gray50}
              style={styles.textTo}
            >
              post:to
            </Text.BodySMedium>
            <Text.H6>{getAudiences(chosenAudiences)}</Text.H6>
          </View>
        </View>
      </View>

      {/* render post content */}
      <ScrollView style={styles.content}>
        <Markdown value={content} />
      </ScrollView>
    </View>
  );

  return (
    <View testID={testID} style={styles.container}>
      {renderTitleHeader()}
      {renderPost()}
    </View>
  );
};

export default ReviewMarkdown;

const getAudiences = (aud: IAudience[]) => {
  if (!aud || aud.length === 0) return '';
  const limitLength = 25;
  let result = '';
  const total = aud.length;
  result = aud[0]?.name || '';
  const left = total - 1;
  if (result?.length > limitLength) {
    result = `${result.substr(
      0, limitLength,
    )}...`;
  } else if (left > 0) {
    result = `${result}, ...`;
  }
  if (left > 0) {
    result = `${result} +${left} ${i18next.t('post:other_places')}`;
  }
  return result;
};

const createStyles = (
  theme: ExtendedTheme, screenHeight: number,
) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      height: 0.8 * screenHeight,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: spacing.margin.large,
    },
    buttonDone: {
      marginRight: spacing.margin.tiny,
    },
    post: {
      flex: 1,
      marginHorizontal: spacing.margin.base,
      marginTop: spacing.margin.large,
      backgroundColor: colors.neutral1,
      paddingHorizontal: spacing.padding.small,
      paddingVertical: spacing.padding.base,
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textTo: {
      marginRight: spacing.margin.tiny,
    },
    audienceLine: {
      flexDirection: 'row',
    },
    content: {
      marginTop: spacing.margin.extraLarge,
    },
    avatar: {
      marginRight: spacing.margin.small,
    },
    flex1: {
      flex: 1,
    },
  });
};
