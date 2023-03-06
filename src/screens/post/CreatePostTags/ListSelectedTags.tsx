import React from 'react';
import { StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { ICreatePostTags } from '~/interfaces/IPost';
import useCreatePostStore from '../CreatePost/store';
import Tag from '~/baseComponents/Tag';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { spacing } from '~/theme';

const ListSelectedTags = () => {
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

  if (!selectedTags || selectedTags.length === 0) {
    return null;
  }

  return (
    <FlatList
      data={selectedTags}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      horizontal
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
});

export default ListSelectedTags;
