import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '~/beinComponents/Text';
import { IPost } from '~/interfaces/IPost';
import { spacing } from '~/theme';
import { formatNumberWithZeroPrefix } from '~/utils/formatData';
import { Button } from '~/baseComponents';

type TitleArticleProps = {
    index: number;
    article: IPost;
}

const TitleArticle: FC<TitleArticleProps> = ({ index, article }) => {
  const { title } = article;
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const onPressMenu = () => {
    // do something
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Text.H1 color={colors.neutral20}>{formatNumberWithZeroPrefix(index)}</Text.H1>
        <View style={styles.slash} />
        <View style={{ flex: 1 }}>
          <Text.H3 numberOfLines={1}>{title}</Text.H3>
        </View>
      </View>
      <Button.Raise
        icon="menu"
        size="small"
        testID="content_header.menu"
        onPress={onPressMenu}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    slash: {
      marginHorizontal: spacing.margin.small,
      borderLeftWidth: 1,
      borderLeftColor: colors.neutral20,
      height: 44,
      transform: [
        {
          rotate: '15deg',
        },
      ],
    },
    titleView: {
      flex: 1,
      marginRight: spacing.margin.small,
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
};

export default TitleArticle;
