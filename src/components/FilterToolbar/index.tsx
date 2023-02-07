import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useDispatch } from 'react-redux';
import PillTabButton from '~/baseComponents/Tab/PillTabButton';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { ISelectedFilterUser } from '~/interfaces/IHome';
import FilterCreatedBy from './FilterCreatedBy';
import FilterDate from './FilterDate';
import * as modalActions from '~/storeRedux/modal/actions';
import spacing from '~/theme/spacing';
import useFilterToolbarStore from './store';
import useFeedSearchStore from '~/screens/Home/HomeSearch/store';

const FilterToolbar = () => {
  const scrollRef = useRef<any>();
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const actions = useFilterToolbarStore((state) => state.actions);
  const filterCreatedBy = useFilterToolbarStore((state) => state.createdBy);
  const filterDate = useFilterToolbarStore((state) => state.datePosted);
  const { startDate, endDate } = filterDate || {};

  const actionsFeedSearch = useFeedSearchStore((state) => state.actions);

  const showModal = (ContentComponent: any, props: any = {}) => {
    dispatch(modalActions.showModal({
      isOpen: true,
      ContentComponent,
      props,
    }));
  };

  const onPressFilterCreatedBy = () => {
    showModal(
      <FilterCreatedBy
        selectedCreatedBy={filterCreatedBy}
        onSelect={onSelectCreatedBy}
      />,
      {
        scrollViewProps: {
          keyboardShouldPersistTaps: 'handled',
        },
      },
    );
  };

  const onSelectDate = (
    startDateSelected?: string, endDateSelected?: string,
  ) => {
    actionsFeedSearch.setNewsfeedSearch({
      searchResults: [],
      hasNextPage: true,
    });
    actions.setFilterDatePosted({ startDate: startDateSelected, endDate: endDateSelected });
  };

  const onPressFilterDate = () => {
    showModal(
      <FilterDate
        startDate={startDate}
        endDate={endDate}
        onSelect={onSelectDate}
      />,
    );
  };

  const onSelectCreatedBy = (selected?: ISelectedFilterUser) => {
    actionsFeedSearch.setNewsfeedSearch({
      searchResults: [],
      hasNextPage: true,
    });
    actions.setFilterCreateBy(selected);
  };

  return (
    <View style={{ ...theme.elevations.e2 }}>
      <ScrollView ref={scrollRef} style={styles.scrollContainer} horizontal>
        <View style={styles.container}>
          <PillTabButton useI18n onPress={onPressFilterDate} type={startDate && endDate ? 'secondary' : 'neutral'}>
            home:newsfeed_search:filter_date
          </PillTabButton>
          <ViewSpacing width={spacing.margin.small} />
          <PillTabButton useI18n onPress={onPressFilterCreatedBy} type={filterCreatedBy ? 'secondary' : 'neutral'}>
            home:newsfeed_search:filter_post_by
          </PillTabButton>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    scrollContainer: {
      backgroundColor: colors.white,
    },
    container: {
      flexDirection: 'row',
      backgroundColor: colors.white,
      paddingTop: spacing.padding.small,
      paddingBottom: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
      borderBottomWidth: 1,
      borderColor: colors.neutral1,
    },
  });
};

export default FilterToolbar;
