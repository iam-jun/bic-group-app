import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import SectionContainer from './SectionContainer';
import SelectionBox from './SelectionBox';
import useSearchStore from '~/screens/Search/store';
import Tag from '~/baseComponents/Tag';
import { spacing } from '~/theme';
import { ICategory } from '~/interfaces/IArticle';
import { useRootNavigation } from '~/hooks/navigation';
import searchStack from '~/router/navigator/MainStack/stacks/searchStack/stack';

type SearchFilterTopicsSectionProps = {
  searchScreenKey: string;
};

const SearchFilterTopicsSection: FC<SearchFilterTopicsSectionProps> = ({
  searchScreenKey,
}) => {
  const { rootNavigation } = useRootNavigation();
  const styles = createStyle();

  const actionsSearchStore = useSearchStore((state) => state.actions);
  const currentFilterTopics = useSearchStore(
    (state) => state.search[searchScreenKey]?.tempFilter?.topics || [],
  );

  const onPressFilterTopicsSection = () => {
    rootNavigation.navigate(searchStack.searchFilterTopics, { searchScreenKey });
  };

  const onPressRemoveTopicSelected = (topic: ICategory) => () => {
    const newFilterTopics = currentFilterTopics.filter(
      (topicItem) => topicItem.id !== topic.id,
    );
    actionsSearchStore.updateTempFilterByScreenKey(searchScreenKey, {
      topics: newFilterTopics,
    });
  };

  const renderTopicsSelected = () => (
    <View style={[styles.row]}>
      {currentFilterTopics.map((topic) => (
        <View style={styles.tagView} key={`tagview-topic-${topic.id}`}>
          <Tag
            style={styles.tag}
            type="neutral"
            label={topic.name}
            textProps={{ numberOfLines: 1 }}
            icon="Xmark"
            onPressIcon={onPressRemoveTopicSelected(topic)}
          />
        </View>
      ))}
    </View>
  );

  return (
    <SectionContainer title="search:topics">
      <SelectionBox
        placeholder="search:select_topic_placeholder"
        onPress={onPressFilterTopicsSection}
      >
        {!!currentFilterTopics
          && currentFilterTopics.length > 0
          && renderTopicsSelected()}
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

export default SearchFilterTopicsSection;
