import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useContext, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useDispatch } from 'react-redux';
import PillTabButton from '~/baseComponents/Tab/PillTabButton';
import { formatDateTime } from '~/beinComponents/TimeView/helper';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { AppContext } from '~/contexts/AppContext';
import { useBaseHook } from '~/hooks';
import { useUserIdAuth } from '~/hooks/auth';
import { useKeySelector } from '~/hooks/selector';
import { ISelectedFilterUser } from '~/interfaces/IHome';
import FilterCreatedBy from '~/screens/Home/HomeSearch/FilterCreatedBy';
import FilterDate from '~/screens/Home/HomeSearch/FilterDate';
import FilterOptionMenu from '~/screens/Home/HomeSearch/FilterOptionMenu';
import homeActions from '~/storeRedux/home/actions';
import homeKeySelector from '~/storeRedux/home/keySelector';
import * as modalActions from '~/storeRedux/modal/actions';
import spacing from '~/theme/spacing';

const FilterToolbar = () => {
  const scrollRef = useRef<any>();
  const dispatch = useDispatch();
  const { language } = useContext(AppContext);
  const theme: ExtendedTheme = useTheme();
  const { t } = useBaseHook();
  const { colors } = theme;
  const styles = createStyle(theme);
  const userId = useUserIdAuth();

  const filterCreatedBy = useKeySelector(homeKeySelector.newsfeedSearchFilterCreatedBy);
  const filterDate = useKeySelector(homeKeySelector.newsfeedSearchFilterDate);
  const { startDate, endDate } = filterDate || {};

  let countFilter = 0;
  if (filterCreatedBy) {
    countFilter += 1;
  }
  if (filterDate) {
    countFilter += 1;
  }

  const textCreatedBy = filterCreatedBy
    ? filterCreatedBy?.id === userId
      ? t('home:newsfeed_search:filter_created_by_me')
      : `${filterCreatedBy?.name}`
    : t('home:newsfeed_search:filter_post_by');
  const textDate = filterDate
    ? `${formatDateTime(
      startDate, language,
    )} - ${formatDateTime(
      endDate,
      language,
    )}`
    : t('home:newsfeed_search:filter_date');

  const showModal = (ContentComponent: any) => {
    dispatch(modalActions.showModal({
      isOpen: true,
      ContentComponent,
    }));
  };

  const onPressFilterCreatedBy = () => {
    showModal(
      <FilterCreatedBy
        selectedCreatedBy={filterCreatedBy}
        onSelect={onSelectCreatedBy}
      />,
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

  const onPressFilterOptions = () => {
    showModal(
      <FilterOptionMenu
        filterCreatedBy={filterCreatedBy}
        filterDate={filterDate}
      />,
    );
  };

  const onSelectCreatedBy = (selected?: ISelectedFilterUser) => {
    dispatch(homeActions.setNewsfeedSearchFilter({ createdBy: selected }));
  };

  const onPressClear = () => {
    dispatch(homeActions.clearNewsfeedSearchFilter());
    scrollRef?.current?.scrollTo?.({ y: 0, animated: true });
  };

  return (
    <View style={{ ...theme.elevations.e2 }}>
      <ScrollView ref={scrollRef} style={styles.scrollContainer} horizontal>
        <View style={styles.container}>
          {/* <Button.Secondary
            onPress={onPressFilterOptions}
            leftIcon="SlidersUp"
            leftIconProps={{
              icon: 'SlidersUp',
              style: {
                marginRight: spacing.margin.small,
                marginLeft: spacing.margin.tiny,
              },
            }}
            color={countFilter > 0 ? colors.purple50 : colors.violet1}
            textColor={countFilter > 0 ? colors.white : colors.purple50}
          >
            {countFilter > 0
              ? `${countFilter}`
              : t('home:newsfeed_search:filter')}
          </Button.Secondary> */}
          <PillTabButton useI18n onPress={onPressFilterDate} type={startDate && endDate ? 'secondary' : 'neutral'}>
            home:newsfeed_search:filter_date
          </PillTabButton>
          <ViewSpacing width={spacing.margin.small} />
          <PillTabButton useI18n onPress={onPressFilterCreatedBy} type={filterCreatedBy ? 'secondary' : 'neutral'}>
            home:newsfeed_search:filter_post_by
          </PillTabButton>
          {/* <Button.Secondary
            onPress={onPressFilterCreatedBy}
            color={filterCreatedBy ? colors.purple10 : colors.violet1}
            textColor={colors.purple50}
          >
            {textCreatedBy}
          </Button.Secondary>
          <Button.Secondary
            onPress={onPressFilterDate}
            style={styles.button}
            color={filterDate ? colors.purple10 : colors.violet1}
            textColor={colors.purple50}
          >
            {textDate}
          </Button.Secondary> */}
          {/* {countFilter > 0 && (
            <Button.Secondary
              style={styles.button}
              textColor={colors.purple50}
              onPress={onPressClear}
              rightIcon="iconCloseSmall"
              rightIconProps={{
                icon: 'iconCloseSmall',
                style: { marginRight: 0, marginLeft: spacing.margin.base },
              }}
            >
              {t('home:newsfeed_search:clear')}
            </Button.Secondary>
          )} */}
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
    button: {
      marginLeft: spacing.margin.small,
    },
  });
};

export default FilterToolbar;
