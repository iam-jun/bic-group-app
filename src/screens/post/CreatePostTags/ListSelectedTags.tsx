import React from 'react';
import { StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { ICreatePostTags } from '~/interfaces/IPost';
import useCreatePostStore from '../CreatePost/store';
import Tag from '~/baseComponents/Tag';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { spacing } from '~/theme';
import Icon from '~/baseComponents/Icon';

const ListSelectedTags = () => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle();

  const selectedTags = useCreatePostStore((state) => state.createPost.tags);
  const createPostStoreActions = useCreatePostStore((state) => state.actions);

  const removeTag = (tag: ICreatePostTags) => {
    createPostStoreActions.removeTag(tag);
  };

  const renderItem: ListRenderItem<ICreatePostTags> = ({ item }) => (
    <Tag
      type="tags"
      label={item.name}
      icon="Xmark"
      onPressIcon={() => removeTag(item)}
    />
  );

  const keyExtractor = (item: ICreatePostTags) => `tag_post_${item.id}`;

  const renderSeparatorComponent = () => <ViewSpacing width={spacing.padding.small} />;

  const renderHeaderComponent = () => (
    <Icon
      size={18}
      tintColor={colors.neutral20}
      icon="Tag"
      style={styles.iconTag}
    />
  );

  if (!selectedTags || selectedTags.length === 0) {
    return null;
  }

  return (
    <FlatList
      testID="list_selected_tags.list_tags"
      data={selectedTags}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      horizontal
      ListHeaderComponent={renderHeaderComponent}
      ItemSeparatorComponent={renderSeparatorComponent}
      style={styles.container}
      showsHorizontalScrollIndicator={false}
      alwaysBounceHorizontal={false}
    />
  );
};

const createStyle = () => StyleSheet.create({
  container: {
    marginVertical: spacing.margin.small,
  },
  iconTag: {
    marginHorizontal: spacing.margin.small,
    marginTop: spacing.margin.tiny,
  },
});

export default ListSelectedTags;
