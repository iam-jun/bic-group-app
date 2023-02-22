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
  selectedStartDate,
  selectedEndDate,
  onDone,
}) => {
  const { t } = useBaseHook();
  const styles = createStyle();

  const [selectedStartDateState, setSelectedStartDateState]
    = useState(selectedStartDate);
  const [selectedEndDateState, setSelectedEndDateState]
    = useState(selectedEndDate);

  const disabledBtn = !selectedStartDateState || !selectedEndDateState;

  const onPress = () => {
    onDone(
      selectedStartDateState.toISOString(),
      selectedEndDateState.toISOString(),
    );
  };

  const onConfirmDatePickerFrom = (date) => setSelectedStartDateState(moment(date).startOf('day').toDate());

  const valueDatePickerFrom = selectedStartDateState && moment(selectedStartDateState).toISOString();
  const maxDatePickerFrom = selectedEndDateState ? moment(selectedEndDateState).toDate() : endOfToday();

  const onConfirmDatePickerTo = (date) => setSelectedEndDateState(moment(date).endOf('day').toDate());

  const valueDatePickerTo = selectedEndDateState && moment(selectedEndDateState).toISOString();
  const maxDatePickerTo = endOfToday();
  const minDatePickerTo = selectedStartDateState && moment(selectedStartDateState).toDate();

  return (
    <TouchableOpacity testID="filter_date" activeOpacity={1} style={styles.container}>
      <Text.H4 style={styles.textHeader}>
        {t('home:newsfeed_search:filter_date')}
      </Text.H4>
      <View style={styles.datePickerContainer}>
        <DateInput
          style={{ marginVertical: 0 }}
          mode="date"
          value={valueDatePickerFrom}
          label={t('home:newsfeed_search:from')}
          maxDate={maxDatePickerFrom}
          onConfirm={onConfirmDatePickerFrom}
        />
        <ViewSpacing height={spacing.padding.large} />
        <DateInput
          style={{ marginVertical: 0 }}
          mode="date"
          value={valueDatePickerTo}
          label={t('home:newsfeed_search:to')}
          minDate={minDatePickerTo}
          maxDate={maxDatePickerTo}
          onConfirm={onConfirmDatePickerTo}
        />
      </View>
      <Button.Secondary disabled={disabledBtn} onPress={onPress} style={styles.buttonDoneDatePicker}>
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
          testID={`btn_option_select_date_${item.key}`}
          key={item.key}
          onPress={() => onSelectItemFilter(item)}
          disabled={item.key === TypeFilter.FromTo}
        >
          <View style={styles.rowItemFilter}>
            <Text.BodyM useI18n color={colors.neutral40}>{item.text}</Text.BodyM>
            {currentFilter === item.key && item.key !== TypeFilter.FromTo && (
              <Icon testID={`filter_date.check_${item.key}`} icon="CircleCheckSolid" tintColor={colors.blue50} />
            )}
            {item.key === TypeFilter.FromTo && (
              <View>
                {currentFilter !== item.key ? (
                  <Button.Secondary testID="btn_select_from_to_date" type="ghost" onPress={() => setStaged(1)}>
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
    <TouchableOpacity testID="filter_date_modal" activeOpacity={1} style={styles.container}>
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
    paddingHorizontal: spacing.padding.large,
    paddingBottom: spacing.padding.large,
  },
});

export default FilterDate;
