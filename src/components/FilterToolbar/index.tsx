import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC, useEffect, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
import PillTabButton from '~/baseComponents/Tab/PillTabButton';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { ISelectedFilterUser } from '~/interfaces/IHome';
import FilterDate from './FilterDate';
import spacing from '~/theme/spacing';
import useFilterToolbarStore from './store';
import {
  getTextFilterDateDisplay,
  getTextFilterPostTypeDisplay,
  getTextNameUserDisplay,
} from './helper';
import FilterCreateBySpecific from './FilterCreateBySpecific';
import { PostType } from '~/interfaces/IPost';
import FilterPostType from './FilterPostType';
import { dimension } from '~/theme';
import useModalStore from '~/store/modal';

type FilterToolbarProps = {
  groupId?: string
}

const FilterToolbar: FC<FilterToolbarProps> = ({ groupId = '' }) => {
  const scrollRef = useRef<any>();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const actions = useFilterToolbarStore((state) => state.actions);
  const filterPostType = useFilterToolbarStore((state) => state.postType);
  const filterCreatedBy = useFilterToolbarStore((state) => state.createdBy);
  const filterDate = useFilterToolbarStore((state) => state.datePosted);
  const { startDate, endDate } = filterDate || {};
  const modalActions = useModalStore((state) => state.actions);

  useEffect(() => {
    actions.setSearchUser({
      groupId,
    });
  }, [groupId]);

  const showModal = (ContentComponent: any, props: any = {}) => {
    modalActions.showModal({
      isOpen: true,
      ContentComponent,
      props,
    });
  };

  const onPressFilterCreatedBy = () => {
    showModal(
      <FilterCreateBySpecific
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
    startDateSelected?: string,
    endDateSelected?: string,
  ) => {
    actions.setFilterDatePosted({
      startDate: startDateSelected,
      endDate: endDateSelected,
    });
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

  const onPressFilterPostType = () => {
    showModal(
      <FilterPostType
        selectedPostType={filterPostType}
        onSelect={onSelectPostType}
      />,
    );
  };

  const onSelectCreatedBy = (selected?: ISelectedFilterUser) => {
    actions.setFilterCreateBy(selected);
  };

  const onSelectPostType = (postType?: PostType) => {
    actions.setFilterPostType(postType);
  };

  const onResetFilterDate = () => {
    onSelectDate();
  };

  const onResetFilterCreatedBy = () => {
    onSelectCreatedBy();
  };

  const onResetFilterPostType = () => {
    onSelectPostType();
  };

  const renderFilterPostTypeOption = () => {
    const textDisplay = getTextFilterPostTypeDisplay(filterPostType);
    const typeBtn = filterPostType ? 'primary' : 'neutral';
    const resetFilterProps = filterPostType && {
      icon: 'Xmark',
      onPressIcon: onResetFilterPostType,
    };
    return (
      <PillTabButton
        testID="filter_tool_bar.btn_filter_post_type"
        onPress={onPressFilterPostType}
        type={typeBtn}
        {...resetFilterProps}
      >
        {textDisplay}
      </PillTabButton>
    );
  };

  const renderFilterDateOption = () => {
    const textDisplay = getTextFilterDateDisplay(startDate, endDate);
    const typeBtn = startDate && endDate ? 'primary' : 'neutral';
    const resetFilterProps = startDate
      && endDate && {
      icon: 'Xmark',
      onPressIcon: onResetFilterDate,
    };
    return (
      <PillTabButton
        testID="filter_tool_bar.filter_date_option"
        onPress={onPressFilterDate}
        type={typeBtn}
        {...resetFilterProps}
      >
        {textDisplay}
      </PillTabButton>
    );
  };

  const renderFilterCreatedByOption = () => {
    const userSelected = filterCreatedBy && {
      id: filterCreatedBy.id,
      fullname: filterCreatedBy.name,
    };
    const textDisplay = getTextNameUserDisplay(userSelected);
    const typeBtn = filterCreatedBy ? 'primary' : 'neutral';
    const resetFilterProps = filterCreatedBy && {
      icon: 'Xmark',
      onPressIcon: onResetFilterCreatedBy,
    };
    return (
      <PillTabButton
        testID="filter_tool_bar.filter_created_by"
        onPress={onPressFilterCreatedBy}
        type={typeBtn}
        {...resetFilterProps}
      >
        {textDisplay}
      </PillTabButton>
    );
  };

  // this is the temporarily solution for fixing bug scrollview is disappeared
  // after removing filter created by (in case of username is long)
  useEffect(() => {
    if (Platform.OS === 'android') {
      scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  }, [filterCreatedBy]);

  return (
    <View style={{ ...theme.elevations.e2 }}>
      <ScrollView
        ref={scrollRef}
        style={styles.scrollContainer}
        contentContainerStyle={styles.container}
        horizontal
        showsHorizontalScrollIndicator={false}
        alwaysBounceHorizontal={false}
      >
        {renderFilterPostTypeOption()}
        <ViewSpacing width={spacing.margin.small} />
        {renderFilterCreatedByOption()}
        <ViewSpacing width={spacing.margin.small} />
        {renderFilterDateOption()}
      </ScrollView>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    scrollContainer: {
      backgroundColor: colors.white,
      width: dimension.deviceWidth,
    },
    container: {
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
