import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '~/baseComponents/Text';
import { Button } from '~/baseComponents';
import { spacing } from '~/theme';
import { formatNumberWithZeroPrefix, escapeMarkDown } from '~/utils/formatter';
import { useRootNavigation } from '~/hooks/navigation';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import { IPost, PostType } from '~/interfaces/IPost';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';

type ListItemProps = {
  listItem: IPost[];
};

type ItemProps = {
  index: number;
  item: IPost;
};

const Item: FC<ItemProps> = ({ index, item }) => {
  const theme = useTheme();
  const { rootNavigation } = useRootNavigation();
  const { colors } = theme;
  const styles = createStyle(theme);
  const { title, content } = item || {};
  const titleItem = item?.type === PostType.ARTICLE ? title : escapeMarkDown(content);

  const goToArticleContentDetail = () => {
    rootNavigation.navigate(articleStack.articleContentDetail, { articleId: item?.id });
  };

  const goToPostDetail = () => {
    rootNavigation.navigate(homeStack.postDetail, { post_id: item?.id });
  };

  const onRedirect = () => {
    if (item?.type === PostType.ARTICLE) {
      goToArticleContentDetail();
    } else {
      goToPostDetail();
    }
  };

  return (
    <Button
      style={styles.articleItemContainer}
      onPress={onRedirect}
      testID={`list_article.article_item_${index}`}
    >
      <Text.H4 color={colors.neutral20}>{formatNumberWithZeroPrefix(index)}</Text.H4>
      <Text style={styles.slash}>/</Text>
      <View style={{ flex: 1 }}>
        {!!titleItem ? (
          <Text.BadgeL color={colors.neutral80} numberOfLines={2}>
            { titleItem }
          </Text.BadgeL>
        ) : (
          <Text.BadgeL color={colors.neutral80} numberOfLines={1} useI18n>
            series:text_no_content
          </Text.BadgeL>
        )}
      </View>
    </Button>
  );
};

const ListItem: FC<ListItemProps> = ({ listItem }) => {
  const theme = useTheme();
  const styles = createStyle(theme);

  if (listItem?.length === 0) return null;

  return (
    <View style={styles.container}>
      {listItem?.map((item, index) => (
        <React.Fragment key={`artc_series_fragment_${item.id}`}>
          <Item
            key={`artc_series_${item.id}`}
            index={index + 1}
            item={item}
          />
          <View style={styles.separator} />
        </React.Fragment>
      ))}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      paddingBottom: spacing.padding.xTiny,
    },
    articleItemContainer: {
      flex: 1,
      flexDirection: 'row',
      paddingBottom: 10,
      paddingTop: 26,
    },
    slash: {
      color: colors.neutral20,
      marginHorizontal: spacing.margin.small,
    },
    separator: {
      borderWidth: 0.5,
      borderColor: colors.neutral5,
      borderStyle: 'dashed',
    },
  });
};

export default ListItem;
