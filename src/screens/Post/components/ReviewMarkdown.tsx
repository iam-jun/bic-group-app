import React from 'react';
import {
  StyleSheet, View, useWindowDimensions, ScrollView,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import i18next from 'i18next';

import Text from '~/beinComponents/Text';

import Button from '~/beinComponents/Button';
import { useKeySelector } from '~/hooks/selector';
import postKeySelector from '~/storeRedux/post/keySelector';
import Markdown from '~/beinComponents/Markdown';
import menuKeySelector from '~/storeRedux/menu/keySelector';
import Avatar from '~/baseComponents/Avatar';
import { IAudience } from '~/interfaces/IPost';
import spacing from '~/theme/spacing';

const ReviewMarkdown = ({ onPressDone }: {onPressDone: () => void}) => {
  const windowDimension = useWindowDimensions();
  const screenHeight = windowDimension.height;

  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(
    theme, screenHeight,
  );
  const content = useKeySelector(postKeySelector.createPost.content);
  const { fullname, avatar } = useKeySelector(menuKeySelector.myProfile) || {};
  const chosenAudiences = useKeySelector(postKeySelector.createPost.chosenAudiences);

  const renderTitleHeader = () => (
    <View style={styles.header}>
      <Text.H5 useI18n>post:text_review_markdown</Text.H5>
      <Button.Secondary
        testID="header.button"
        style={styles.buttonDone}
        textColor={theme.colors.purple50}
        textProps={{ useI18n: true }}
        onPress={onPressDone}
      >
        common:btn_done
      </Button.Secondary>
    </View>
  );

  const renderPost = () => (
    <View style={styles.post}>
      {/* render post header */}
      <View style={styles.postHeader}>
        <Avatar.Medium isRounded source={avatar} style={{ marginRight: 8 }} />
        <View>
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
    <View style={styles.container}>
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
      borderWidth: 1,
      borderColor: colors.purple50,
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
  });
};
