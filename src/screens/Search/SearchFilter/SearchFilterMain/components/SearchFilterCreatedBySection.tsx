import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import SectionContainer from './SectionContainer';
import SelectionBox from './SelectionBox';
import useSearchStore from '~/screens/Search/store';
import Tag from '~/baseComponents/Tag';
import { spacing } from '~/theme';
import { ISearchUser } from '~/interfaces/ISearch';
import { useRootNavigation } from '~/hooks/navigation';
import searchStack from '~/router/navigator/MainStack/stacks/searchStack/stack';

type SearchFilterCreatedBySectionProps = {
  searchScreenKey: string;
};

const SearchFilterCreatedBySection: FC<SearchFilterCreatedBySectionProps> = ({
  searchScreenKey,
}) => {
  const { rootNavigation } = useRootNavigation();
  const styles = createStyle();

  const actionsSearchStore = useSearchStore((state) => state.actions);
  const currentFilterCreatedBy = useSearchStore(
    (state) => state.search[searchScreenKey]?.tempFilter?.createdBy || [],
  );

  const onPressFilterCreatedBySection = () => {
    rootNavigation.navigate(searchStack.searchFilterUsers, { searchScreenKey });
  };

  const onPressRemoveUserSelected = (user: ISearchUser) => () => {
    const newFilterCreatedBy = currentFilterCreatedBy.filter(
      (userItem) => userItem.id !== user.id,
    );
    actionsSearchStore.updateTempFilterByScreenKey(searchScreenKey, {
      createdBy: newFilterCreatedBy,
    });
  };

  const renderUsersSelected = () => (
    <View style={[styles.row]}>
      {currentFilterCreatedBy.map((user) => (
        <View style={styles.tagView} key={`tag-user-view-${user.id}`}>
          <Tag
            style={styles.tag}
            type="neutral"
            avatar={{ uri: user.avatar }}
            label={user.fullname}
            textProps={{ numberOfLines: 1 }}
            icon="Xmark"
            onPressIcon={onPressRemoveUserSelected(user)}
          />
        </View>
      ))}
    </View>
  );

  return (
    <SectionContainer title="search:filter_created_by">
      <SelectionBox
        placeholder="search:select_created_by_placeholder"
        onPress={onPressFilterCreatedBySection}
      >
        {!!currentFilterCreatedBy
          && currentFilterCreatedBy.length > 0
          && renderUsersSelected()}
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
  },
  tag: {
    alignSelf: 'baseline',
    marginRight: 0,
  },
});

export default SearchFilterCreatedBySection;
