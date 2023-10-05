import React, { FC } from 'react';
import { useTheme } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import SectionContainer from './SectionContainer';
import SelectionBox from './SelectionBox';
import useSearchStore from '~/screens/Search/store';
import Image from '~/components/Image';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import Text from '~/baseComponents/Text';
import Icon from '~/baseComponents/Icon';
import Toggle from '~/baseComponents/Toggle';
import { useRootNavigation } from '~/hooks/navigation';
import searchStack from '~/router/navigator/MainStack/stacks/searchStack/stack';

type SearchFilterGroupSectionProps = {
  searchScreenKey: string;
};

const SearchFilterGroupSection: FC<SearchFilterGroupSectionProps> = ({
  searchScreenKey,
}) => {
  const { rootNavigation } = useRootNavigation();
  const theme = useTheme();
  const { colors } = theme;
  const styles = createStyle();

  const actionsSearchStore = useSearchStore((state) => state.actions);
  const currentFilterGroup = useSearchStore(
    (state) => state.search[searchScreenKey]?.tempFilter?.group,
  );
  const currentIsSelectAllInnerGroups = useSearchStore(
    (state) => state.search[searchScreenKey]?.tempFilter?.isSelectAllInnerGroups || false,
  );

  const onPressFilterGroupSection = () => {
    rootNavigation.navigate(searchStack.searchFilterGroup, { searchScreenKey });
  };

  const onPressRemoveGroupSelected = () => {
    actionsSearchStore.updateTempFilterByScreenKey(searchScreenKey, {
      group: undefined,
      isSelectAllInnerGroups: false,
    });
  };

  const onToggleSelectAllInnerGroup = (isChecked?: boolean) => {
    actionsSearchStore.updateTempFilterByScreenKey(searchScreenKey, {
      isSelectAllInnerGroups: isChecked,
    });
  };

  const renderGroupSelected = () => (
    <View style={[styles.row]}>
      <View style={[styles.row, { flex: 1 }]}>
        <Image style={styles.img} source={{ uri: currentFilterGroup?.icon }} />
        <ViewSpacing width={spacing.margin.small} />
        <View style={{ flex: 1 }}>
          <Text.BodyXS numberOfLines={1}>{currentFilterGroup?.name}</Text.BodyXS>
        </View>
      </View>
      <ViewSpacing width={spacing.margin.small} />
      <Icon
        testID="search_filter_group_section.remove"
        icon="Xmark"
        size={16}
        tintColor={colors.neutral40}
        onPress={onPressRemoveGroupSelected}
      />
    </View>
  );

  const renderSelectedAllInnerGroup = () => (
    <View style={[styles.row, { justifyContent: 'space-between' }]}>
      <Text.BodyMMedium useI18n color={colors.neutral60}>
        search:selected_all_inner_group
      </Text.BodyMMedium>
      <Toggle
        testID="search_filter_group_section.toggle"
        disabled={!currentFilterGroup}
        isChecked={currentIsSelectAllInnerGroups}
        onValueChanged={onToggleSelectAllInnerGroup}
      />
    </View>
  );

  return (
    <SectionContainer title="search:group">
      <SelectionBox
        isShowCaret
        placeholder="search:select_group_placeholder"
        onPress={onPressFilterGroupSection}
      >
        {!!currentFilterGroup && renderGroupSelected()}
      </SelectionBox>
      <ViewSpacing height={spacing.margin.large} />
      {renderSelectedAllInnerGroup()}
    </SectionContainer>
  );
};

const createStyle = () => StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    height: 24,
    width: 24,
    borderRadius: 2,
  },
});

export default SearchFilterGroupSection;
