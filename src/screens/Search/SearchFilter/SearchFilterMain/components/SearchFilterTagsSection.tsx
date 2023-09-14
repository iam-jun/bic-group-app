import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import SectionContainer from './SectionContainer';
import SelectionBox from './SelectionBox';
import useSearchStore from '~/screens/Search/store';
import Tag from '~/baseComponents/Tag';
import { spacing } from '~/theme';
import { useRootNavigation } from '~/hooks/navigation';
import searchStack from '~/router/navigator/MainStack/stacks/searchStack/stack';

type SearchFilterTagsSectionProps = {
  searchScreenKey: string;
};

const SearchFilterTagsSection: FC<SearchFilterTagsSectionProps> = ({
  searchScreenKey,
}) => {
  const { rootNavigation } = useRootNavigation();
  const styles = createStyle();

  const actionsSearchStore = useSearchStore((state) => state.actions);
  const currentFilterTags = useSearchStore(
    (state) => state.search[searchScreenKey]?.tempFilter?.tags || [],
  );

  const onPressFilterTagsSection = () => {
    rootNavigation.navigate(searchStack.searchFilterTags, { searchScreenKey });
  };

  const onPressRemoveTagSelected = (tag: string) => () => {
    const newFilterTags = currentFilterTags.filter(
      (tagItem) => tagItem !== tag,
    );
    actionsSearchStore.updateTempFilterByScreenKey(searchScreenKey, {
      tags: newFilterTags,
    });
  };

  const renderTagsSelected = () => (
    <View style={[styles.row]}>
      {currentFilterTags.map((tag, index) => (
        <View style={styles.tagView} key={`tagview-${index}`}>
          <Tag
            testID={`search_filter_tags_section.tag_${index}`}
            style={styles.tag}
            type="neutral"
            label={tag}
            textProps={{ numberOfLines: 1 }}
            icon="Xmark"
            onPressIcon={onPressRemoveTagSelected(tag)}
          />
        </View>
      ))}
    </View>
  );

  return (
    <SectionContainer title="search:tags">
      <SelectionBox
        placeholder="search:select_tag_placeholder"
        onPress={onPressFilterTagsSection}
      >
        {!!currentFilterTags
          && currentFilterTags.length > 0
          && renderTagsSelected()}
      </SelectionBox>
    </SectionContainer>
  );
};

const createStyle = () => StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagView: {
    marginHorizontal: spacing.margin.xTiny,
    marginVertical: spacing.margin.tiny,
    flexShrink: 1,
  },
  tag: {
    alignSelf: 'baseline',
    marginRight: 0,
  },
});

export default SearchFilterTagsSection;
