import {
  View, FlatList, StyleSheet,
} from 'react-native';
import React, { FC, useEffect } from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Header from '~/beinComponents/Header';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import useArticleListStore from './store';
import { IArticleListState } from './store/Interface';
import ContentItem from '~/components/ContentItem';

const ArticleList: FC = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const ids = useArticleListStore((state: IArticleListState) => state.ids);
  const actions = useArticleListStore((state: IArticleListState) => state.actions);

  useEffect(() => {
    actions.getArticles();
  }, []);

  const onEndReached = () => actions.getArticles();

  const renderItem = ({ item: id }) => (
    <ContentItem id={id} />
  );

  return (
    <View style={styles.container}>
      <Header
        hideBack
        // headerRef={headerRef}
        title="tabs:articles"
        titleTextProps={{ useI18n: true }}
        icon="iconSearch"
        // onPressIcon={onPressSearch}
      />
      <FlatList
        data={ids}
        renderItem={renderItem}
        keyExtractor={(item) => `artitle-${item}`}
        ItemSeparatorComponent={() => <ViewSpacing height={16} />}
        onEndReached={onEndReached}
      />
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray5,
    },
  });
};

export default ArticleList;
