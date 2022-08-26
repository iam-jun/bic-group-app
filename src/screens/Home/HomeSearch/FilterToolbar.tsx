import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useDispatch } from 'react-redux';
import PillTabButton from '~/baseComponents/Tab/PillTabButton';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { useKeySelector } from '~/hooks/selector';
import { ISelectedFilterUser } from '~/interfaces/IHome';
import FilterCreatedBy from '~/screens/Home/HomeSearch/FilterCreatedBy';
import FilterDate from '~/screens/Home/HomeSearch/FilterDate';
import homeActions from '~/storeRedux/home/actions';
import homeKeySelector from '~/storeRedux/home/keySelector';
import * as modalActions from '~/storeRedux/modal/actions';
import spacing from '~/theme/spacing';

const FilterToolbar = () => {
  const scrollRef = useRef<any>();
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const filterCreatedBy = useKeySelector(homeKeySelector.newsfeedSearchFilterCreatedBy);
  const filterDate = useKeySelector(homeKeySelector.newsfeedSearchFilterDate);
  const { startDate, endDate } = filterDate || {};

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
    startDate?: string, endDate?: string,
  ) => {
    dispatch(homeActions.setNewsfeedSearchFilter({ date: { startDate, endDate } }));
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
    dispatch(homeActions.setNewsfeedSearchFilter({ createdBy: selected }));
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
