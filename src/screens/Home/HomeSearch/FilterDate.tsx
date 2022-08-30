import React, {
  FC, useContext, useEffect, useState,
} from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import moment from 'moment';
import Button from '~/baseComponents/Button';
import Text from '~/beinComponents/Text';
import { AppContext } from '~/contexts/AppContext';
import { useBaseHook } from '~/hooks';
import modalActions from '~/storeRedux/modal/actions';

import spacing from '~/theme/spacing';
import {
  endOfToday,
  getDefaultEndDate, getDefaultStartDate, getTimeAgo, isDiffBetweenTwoDates,
} from './helper';
import Icon from '~/baseComponents/Icon';
import Tag from '~/baseComponents/Tag';
import { formatDateWithSameDayLabel } from '~/beinComponents/TimeView/helper';
import { DateInput } from '~/baseComponents/Input';
import ViewSpacing from '~/beinComponents/ViewSpacing';

export interface NFSFilterDateProps {
  startDate?: string;
  endDate?: string;
  onSelect?: (startDate?: string, endDate?: string) => void;
}

type DatePickerContainerProps = {
  selectedStartDate: Date;
  setSelectedStartDate: (date: Date) => void;
  selectedEndDate: Date;
  setSelectedEndDate: (date: Date) => void;
  onDone: () => void;
};

const typeFilter = {
  all: 'ALL',
  sevenDaysAgo: '7DaysAgo',
  thirtyDaysAgo: '30DaysAgo',
  threeMonthsAgo: '3MonthsAgo',
  fromTo: 'fromTo',
};

const itemFilter = [
  {
    key: typeFilter.all,
    text: 'common:all',
  },
  {
    key: typeFilter.sevenDaysAgo,
    text: 'home:newsfeed_search:seven_days_ago',
  },
  {
    key: typeFilter.thirtyDaysAgo,
    text: 'home:newsfeed_search:thirty_days_ago',
  },
  {
    key: typeFilter.threeMonthsAgo,
    text: 'home:newsfeed_search:three_months_ago',
  },
  {
    key: typeFilter.fromTo,
    text: 'home:newsfeed_search:from_to',
  },
];

const getCurrentFilterByTimeRange = (startDate?: string, endDate?: string) => {
  if (!startDate && !endDate) {
    return typeFilter.all;
  }

  if (isDiffBetweenTwoDates(startDate, endDate, 7, 'days')) {
    return typeFilter.sevenDaysAgo;
  }

  if (isDiffBetweenTwoDates(startDate, endDate, 30, 'days')) {
    return typeFilter.thirtyDaysAgo;
  }

  if (isDiffBetweenTwoDates(startDate, endDate, 3, 'months')) {
    return typeFilter.threeMonthsAgo;
  }

  return typeFilter.fromTo;
};

const DatePickerContainer: FC<DatePickerContainerProps> = ({
  selectedStartDate = getDefaultStartDate(),
  selectedEndDate = getDefaultEndDate(),
  setSelectedStartDate,
  setSelectedEndDate,
  onDone,
}) => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  useEffect(() => {
    setSelectedStartDate(selectedStartDate);
    setSelectedEndDate(selectedEndDate);
  }, []);

  return (
    <TouchableOpacity activeOpacity={1} style={styles.container}>
      <Text.H4 style={styles.textHeader}>
        {t('home:newsfeed_search:filter_date')}
      </Text.H4>
      <View style={styles.datePickerContainer}>
        <DateInput
          style={{ marginVertical: 0 }}
          mode="date"
          value={moment(selectedStartDate).toISOString(true)}
          label={t('home:newsfeed_search:from')}
          maxDate={moment(selectedEndDate).toDate()}
          onConfirm={(date) => setSelectedStartDate(date)}
        />
        <ViewSpacing height={spacing.padding.large} />
        <DateInput
          style={{ marginVertical: 0 }}
          mode="date"
          value={moment(selectedEndDate).toISOString(true)}
          label={t('home:newsfeed_search:to')}
          minDate={moment(selectedStartDate).toDate()}
          maxDate={endOfToday()}
          onConfirm={(date) => setSelectedEndDate(moment(date).endOf('day').toDate())}
        />
      </View>
      <Button.Secondary
        onPress={onDone}
        style={styles.buttonDoneDatePicker}
        type="ghost"
      >
        {t('common:btn_done')}
      </Button.Secondary>
    </TouchableOpacity>
  );
};

const FilterDate: FC<NFSFilterDateProps> = ({
  startDate,
  endDate,
  onSelect,
}: NFSFilterDateProps) => {
  const [staged, setStaged] = useState(0);
  const [selectedStartDate, setSelectedStartDate] = useState<any>(startDate);
  const [selectedEndDate, setSelectedEndDate] = useState<any>(endDate);

  const dispatch = useDispatch();
  const { language } = useContext(AppContext);
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(theme);

  const currentFilter = getCurrentFilterByTimeRange(
    selectedStartDate,
    selectedEndDate,
  );

  const onPressApply = () => {
    dispatch(modalActions.hideModal());
    onSelect?.(selectedStartDate, selectedEndDate);
  };

  const onDone = () => {
    setStaged(0);
  };

  const onSelectItemFilter = (item: any) => {
    switch (item.key) {
      case typeFilter.all:
        setSelectedStartDate(undefined);
        setSelectedEndDate(undefined);
        break;
      case typeFilter.sevenDaysAgo:
        setSelectedStartDate(getTimeAgo(7, 'days'));
        setSelectedEndDate(endOfToday());
        break;
      case typeFilter.thirtyDaysAgo:
        setSelectedStartDate(getTimeAgo(30, 'days'));
        setSelectedEndDate(endOfToday());
        break;
      case typeFilter.threeMonthsAgo:
        setSelectedStartDate(getTimeAgo(3, 'months'));
        setSelectedEndDate(endOfToday());
        break;
      default:
        break;
    }
  };

  const renderFilter = () => (
    <>
      {itemFilter.map((item) => (
        <Button
          onPress={() => onSelectItemFilter(item)}
          disabled={item.key === typeFilter.fromTo}
        >
          <View key={item.key} style={styles.rowItemFilter}>
            <Text.BodyMMedium useI18n>{item.text}</Text.BodyMMedium>
            {currentFilter === item.key && item.key !== typeFilter.fromTo && (
              <Icon icon="CircleCheckSolid" tintColor={colors.blue50} />
            )}
            {item.key === typeFilter.fromTo && (
              <View>
                {currentFilter !== item.key ? (
                  <Button.Secondary type="ghost" onPress={() => setStaged(1)}>
                    {t('common:text_select')}
                  </Button.Secondary>
                ) : (
                  <Tag
                    style={styles.tagContainer}
                    type="secondary"
                    size="small"
                    label={formatDateWithSameDayLabel(
                      selectedStartDate,
                      selectedEndDate,
                      language,
                    )}
                    onActionPress={() => setStaged(1)}
                    icon="Xmark"
                    onPressIcon={() => {
                      setSelectedStartDate(undefined);
                      setSelectedEndDate(undefined);
                    }}
                  />
                )}
              </View>
            )}
          </View>
        </Button>
      ))}
    </>
  );

  if (staged === 1) {
    return (
      <DatePickerContainer
        selectedStartDate={selectedStartDate}
        setSelectedStartDate={setSelectedStartDate}
        selectedEndDate={selectedEndDate}
        setSelectedEndDate={setSelectedEndDate}
        onDone={onDone}
      />
    );
  }

  return (
    <TouchableOpacity activeOpacity={1} style={styles.container}>
      <Text.H4 style={styles.textHeader}>
        {t('home:newsfeed_search:filter_date')}
      </Text.H4>
      {renderFilter()}
      <Button.Secondary onPress={onPressApply} style={styles.buttonApply}>
        {t('home:newsfeed_search:apply')}
      </Button.Secondary>
    </TouchableOpacity>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      paddingBottom: spacing.padding.extraLarge,
    },
    textHeader: {
      marginTop: spacing.margin.tiny,
      marginBottom: spacing.margin.large,
      marginHorizontal: spacing.margin.large,
    },
    buttonApply: {
      marginHorizontal: spacing.margin.extraLarge,
      marginVertical: spacing.margin.small,
    },
    buttonDoneDatePicker: {
      marginHorizontal: spacing.margin.extraLarge,
      marginBottom: spacing.margin.small,
      marginTop: spacing.margin.tiny,
    },
    rowItemFilter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.margin.extraLarge,
      paddingHorizontal: spacing.padding.large,
    },
    tagContainer: {
      alignSelf: 'baseline',
    },
    datePickerContainer: {
      padding: spacing.padding.large,
    },
  });
};

export default FilterDate;
