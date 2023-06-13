import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Text from '~/baseComponents/Text';
import { IPost } from '~/interfaces/IPost';
import Icon from '~/baseComponents/Icon';
import ContentItem from './ContentItem';
import { spacing } from '~/theme';
import { getPrevAndNextContentInSeries } from '../helper';

type SeriesItemProps = {
    postId: string;
    series: IPost
}

const SeriesItem: FC<SeriesItemProps> = ({ postId, series }) => {
  const { title } = series;
  const theme = useTheme();
  const styles = createStyle(theme);

  const [isExpand, setIsExpand] = useState(false);

  const { prevContent, nextContent } = getPrevAndNextContentInSeries(postId, series) || {};

  if (!prevContent || !nextContent) return null;

  return (
    <View>
      <TouchableWithoutFeedback onPress={() => setIsExpand(!isExpand)}>
        <View style={styles.container}>
          <View style={styles.containerTitle}>
            <Text.BodyMMedium numberOfLines={2}>{title}</Text.BodyMMedium>
          </View>
          <Icon tintColor={theme.colors.neutral40} size={14} icon={isExpand ? 'ChevronUp' : 'ChevronDown'} />
        </View>
      </TouchableWithoutFeedback>
      {
        isExpand && (
        <Animated.View entering={FadeInUp}>
          <View>
            <ContentItem item={prevContent} isPrev />
            <ContentItem item={nextContent} isPrev={false} />
          </View>
        </Animated.View>
        )
      }
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      paddingVertical: 20,
      borderTopColor: colors.neutral5,
      borderTopWidth: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    containerTitle: {
      flex: 1,
      marginRight: spacing.padding.tiny,
    },
    textTitle: {
      color: colors.neutral80,
    },
  });
};

export default SeriesItem;
