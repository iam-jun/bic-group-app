import React, { FC, useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import moment from 'moment';
import Button from '~/baseComponents/Button';
import Text from '~/baseComponents/Text';
import { AppContext } from '~/contexts/AppContext';
import { useBaseHook } from '~/hooks';

import spacing from '~/theme/spacing';
import Tag from '~/baseComponents/Tag';
import { formatDateWithSameDayLabel } from '~/beinComponents/TimeView/helper';
import { DateInput } from '~/baseComponents/Input';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import {
  endOfTime,
  endOfToday,
  getCurrentFilterByTimeRange,
  startOfTime,
} from '../helper';
import { itemFilter, TypeFilter } from '../constants';
import useModalStore from '~/store/modal';
import { Radio } from '~/baseComponents';

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

  const valueDatePickerFrom
    = selectedStartDateState && moment(selectedStartDateState).toISOString();
  const maxDatePickerFrom = selectedEndDateState
    ? moment(selectedEndDateState).toDate()
    : endOfToday();

  const onConfirmDatePickerTo = (date) => setSelectedEndDateState(moment(date).endOf('day').toDate());

  const valueDatePickerTo
    = selectedEndDateState && moment(selectedEndDateState).toISOString();
  const maxDatePickerTo = endOfToday();
  const minDatePickerTo
    = selectedStartDateState && moment(selectedStartDateState).toDate();

  return (
    <TouchableOpacity
      testID="filter_date"
      activeOpacity={1}
      style={styles.container}
    >
      <Text.H4 style={styles.textHeader}>
        {t('search:filter_date_posted')}
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
      <Button.Primary
        type="solid"
        disabled={disabledBtn}
        onPress={onPress}
        style={styles.buttonDoneDatePicker}
      >
        {t('home:newsfeed_search:apply')}
      </Button.Primary>
    </TouchableOpacity>
  );
};

const FilterDate: FC<NFSFilterDateProps> = ({
  startDate,
  endDate,
  onSelect,
}) => {
  const { language } = useContext(AppContext);
  const styles = createStyle();

  const currentFilter = getCurrentFilterByTimeRange(startDate, endDate);
  const modalActions = useModalStore((state) => state.actions);

  const onPressApply = (
    selectedStartDate?: string,
    selectedEndDate?: string,
  ) => {
    onSelect?.(selectedStartDate, selectedEndDate);
  };

  const onDone = (selectedStartDate: string, selectedEndDate: string) => {
    onPressApply(selectedStartDate, selectedEndDate);
    modalActions.hideModal();
  };

  const showModal = (ContentComponent: any, props: any = {}) => {
    modalActions.showModal({
      isOpen: true,
      ContentComponent,
      props,
    });
  };

  const onPressFilterCustomDate = () => {
    const selectedStartDate = startDate && moment(startDate).toDate();
    const selectedEndDate = endDate && moment(endDate).toDate();

    showModal(
      <DatePickerContainer
        selectedStartDate={selectedStartDate}
        selectedEndDate={selectedEndDate}
        onDone={onDone}
      />,
    );
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
      case TypeFilter.FromTo:
        onPressFilterCustomDate();
        break;
      default:
        break;
    }
  };

  const renderFilterDateOptions = () => itemFilter.map((item, index) => (
    <React.Fragment key={`filter-date-option-${item.key}`}>
      <View style={styles.row}>
        <Radio
          testID={`filter_date.option_${item.key}`}
          useI18n
          label={item.text}
          isChecked={currentFilter === item.key}
          onPress={() => onSelectItemFilter(item)}
        />
        {item.key === TypeFilter.FromTo && currentFilter === item.key && (
        <Tag
          testID="filter_date.option_custom_tag"
          style={styles.tagContainer}
          type="secondary"
          size="small"
          label={formatDateWithSameDayLabel(startDate, endDate, language)}
          onActionPress={() => onSelectItemFilter(item)}
        />
        )}
      </View>
      {index < itemFilter.length - 1 && (
      <ViewSpacing height={spacing.margin.large} />
      )}
    </React.Fragment>
  ));

  return <>{renderFilterDateOptions()}</>;
};

const createStyle = () => StyleSheet.create({
  container: {
    paddingBottom: spacing.padding.large,
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
    marginHorizontal: spacing.margin.large,
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
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default FilterDate;
