import React, { FC, useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import moment from 'moment';
import Button from '~/baseComponents/Button';
import Text from '~/baseComponents/Text';
import { AppContext } from '~/contexts/AppContext';
import { useBaseHook } from '~/hooks';
import modalActions from '~/storeRedux/modal/actions';

import spacing from '~/theme/spacing';
import Icon from '~/baseComponents/Icon';
import Tag from '~/baseComponents/Tag';
import { formatDateWithSameDayLabel } from '~/beinComponents/TimeView/helper';
import { DateInput } from '~/baseComponents/Input';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import {
  endOfTime,
  endOfToday,
  getCurrentFilterByTimeRange,
  startOfTime,
} from './helper';
import { itemFilter, TypeFilter } from './constants';

export interface NFSFilterDateProps {
  startDate?: string;
  endDate?: string;
  onSelect?: (startDate?: string, endDate?: string) => void;
}

type DatePickerContainerProps = {
  selectedStartDate: Date;
  selectedEndDate: Date;
  onDone: (selectedStartDate: string, selectedEndDate: string) => void;
};

const DatePickerContainer: FC<DatePickerContainerProps> = ({
  selectedStartDate = startOfTime(TypeFilter.LastSevenDays).toDate(),
  selectedEndDate = endOfTime(TypeFilter.LastSevenDays).toDate(),
  onDone,
}) => {
  const { t } = useBaseHook();
  const styles = createStyle();

  const [selectedStartDateState, setSelectedStartDateState]
    = useState(selectedStartDate);
  const [selectedEndDateState, setSelectedEndDateState]
    = useState(selectedEndDate);

  const onPress = () => {
    onDone(
      selectedStartDateState.toISOString(),
      selectedEndDateState.toISOString(),
    );
  };

  return (
    <TouchableOpacity activeOpacity={1} style={styles.container}>
      <Text.H4 style={styles.textHeader}>
        {t('home:newsfeed_search:filter_date')}
      </Text.H4>
      <View style={styles.datePickerContainer}>
        <DateInput
          style={{ marginVertical: 0 }}
          mode="date"
          value={moment(selectedStartDateState).toISOString()}
          label={t('home:newsfeed_search:from')}
          maxDate={moment(selectedEndDateState).toDate()}
          onConfirm={(date) => setSelectedStartDateState(moment(date).startOf('day').toDate())}
        />
        <ViewSpacing height={spacing.padding.large} />
        <DateInput
          style={{ marginVertical: 0 }}
          mode="date"
          value={moment(selectedEndDateState).toISOString()}
          label={t('home:newsfeed_search:to')}
          minDate={moment(selectedStartDateState).toDate()}
          maxDate={endOfToday()}
          onConfirm={(date) => setSelectedEndDateState(moment(date).endOf('day').toDate())}
        />
      </View>
      <Button.Secondary onPress={onPress} style={styles.buttonDoneDatePicker}>
        {t('home:newsfeed_search:apply')}
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

  const dispatch = useDispatch();
  const { language } = useContext(AppContext);
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle();

  const currentFilter = getCurrentFilterByTimeRange(startDate, endDate);

  const onPressApply = (
    selectedStartDate?: string,
    selectedEndDate?: string,
  ) => {
    dispatch(modalActions.hideModal());
    onSelect?.(selectedStartDate, selectedEndDate);
  };

  const onDone = (selectedStartDate: string, selectedEndDate: string) => {
    onPressApply(selectedStartDate, selectedEndDate);
  };

  const onSelectItemFilter = (item: any) => {
    switch (item.key) {
      case TypeFilter.Today:
        {
          const selectedStartDate = startOfTime(TypeFilter.Today).toISOString();
          const selectedEndDate = endOfTime(TypeFilter.Today).toISOString();
          onPressApply(selectedStartDate, selectedEndDate);
        }
        break;
      case TypeFilter.Yesterday:
        {
          const selectedStartDate = startOfTime(
            TypeFilter.Yesterday,
          ).toISOString();
          const selectedEndDate = endOfTime(TypeFilter.Yesterday).toISOString();
          onPressApply(selectedStartDate, selectedEndDate);
        }
        break;
      case TypeFilter.LastSevenDays:
        {
          const selectedStartDate = startOfTime(
            TypeFilter.LastSevenDays,
          ).toISOString();
          const selectedEndDate = endOfTime(
            TypeFilter.LastSevenDays,
          ).toISOString();
          onPressApply(selectedStartDate, selectedEndDate);
        }
        break;
      default:
        break;
    }
  };

  const renderFilter = () => (
    <>
      {itemFilter.map((item) => (
        <Button
          key={item.key}
          onPress={() => onSelectItemFilter(item)}
          disabled={item.key === TypeFilter.FromTo}
        >
          <View style={styles.rowItemFilter}>
            <Text.BodyMMedium useI18n>{item.text}</Text.BodyMMedium>
            {currentFilter === item.key && item.key !== TypeFilter.FromTo && (
              <Icon icon="CircleCheckSolid" tintColor={colors.blue50} />
            )}
            {item.key === TypeFilter.FromTo && (
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
                      startDate,
                      endDate,
                      language,
                    )}
                    onActionPress={() => setStaged(1)}
                    // icon="Xmark"
                    // onPressIcon={() => {
                    //   setSelectedStartDate(undefined);
                    //   setSelectedEndDate(undefined);
                    // }}
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
    const selectedStartDate = startDate && moment(startDate).toDate();
    const selectedEndDate = endDate && moment(endDate).toDate();

    return (
      <DatePickerContainer
        selectedStartDate={selectedStartDate}
        selectedEndDate={selectedEndDate}
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
    </TouchableOpacity>
  );
};

const createStyle = () => StyleSheet.create({
  container: {
    paddingBottom: spacing.padding.extraLarge,
  },
  textHeader: {
    marginTop: spacing.margin.tiny,
    marginBottom: spacing.margin.extraLarge,
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

export default FilterDate;
