import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import {
  FlatList, StyleSheet, View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '~/baseComponents/Button';
import Icon from '~/baseComponents/Icon';
import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import Text from '~/beinComponents/Text';
import { createTextStyle } from '~/beinComponents/Text/textStyle';

import { useBaseHook } from '~/hooks';
import { useRootNavigation } from '~/hooks/navigation';
import { EditArticleProps } from '~/interfaces/IArticle';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import useEditArticle from '~/screens/articles/EditArticle/hooks/useEditArticle';
import modalActions from '~/storeRedux/modal/actions';
import spacing from '~/theme/spacing';

const editOptions = [
  { title: 'article:text_option_edit_title', screen: articleStack.editArticleTitle },
  { title: 'article:text_option_edit_description', screen: articleStack.editArticleSummary },
  { title: 'article:text_option_edit_cover', screen: articleStack.editArticleCover },
  { title: 'article:text_option_edit_category', screen: articleStack.editArticleCategory },
  { title: 'article:text_option_edit_audience', screen: articleStack.editArticleAudience },
  { title: 'article:text_option_edit_content', screen: articleStack.editArticleContent },
];

const EditArticle: FC<EditArticleProps> = ({ route }: EditArticleProps) => {
  const articleId = route?.params?.articleId;

  const dispatch = useDispatch();
  const { rootNavigation } = useRootNavigation();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  useEditArticle({ articleId });

  const onPressItem = (item: any) => {
    if (!item.screen) {
      dispatch(modalActions.showAlertNewFeature());
      return;
    }
    rootNavigation.navigate(item.screen, { articleId });
  };

  const renderItem = ({ item }: any) => (
    <Button style={styles.item} onPress={() => onPressItem(item)}>
      <Text style={styles.itemTitle} useI18n>{item.title}</Text>
      <Icon icon="AngleRight" />
    </Button>
  );

  return (
    <View style={styles.container}>
      <Header title={t('article:title_edit_article')} />
      <FlatList
        data={editOptions}
        renderItem={renderItem}
        keyExtractor={(item) => `edit_article_item_${item.title}`}
        ItemSeparatorComponent={() => <Divider margin={spacing.margin.large} />}
      />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const textStyle = createTextStyle(theme);

  const { colors } = theme;
  return StyleSheet.create({
    flex1: { flex: 1 },
    container: {
      flex: 1,
      backgroundColor: colors.neutral,
    },
    inputTitle: {
      ...textStyle.bodyMMedium,
      paddingVertical: spacing.padding.small,
      paddingHorizontal: spacing.padding.large,
      borderBottomWidth: 1,
      borderColor: colors.gray5,
      maxHeight: 80,
    },
    item: {
      flexDirection: 'row',
      paddingVertical: spacing.padding.large,
      paddingHorizontal: spacing.padding.large,
    },
    itemTitle: {
      flex: 1,
    },
  });
};

export default EditArticle;
