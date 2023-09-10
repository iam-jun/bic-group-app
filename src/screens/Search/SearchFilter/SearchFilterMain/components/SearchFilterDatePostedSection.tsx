import React, { FC } from 'react';
import { isEmpty } from 'lodash';
import SectionContainer from './SectionContainer';
import useSearchStore from '~/screens/Search/store';
import FilterDate from './FilterDate';

type SearchFilterDatePostedSectionProps = {
  searchScreenKey: string;
};

const SearchFilterDatePostedSection: FC<SearchFilterDatePostedSectionProps> = ({
  searchScreenKey,
}) => {
  const actionsSearchStore = useSearchStore((state) => state.actions);
  const currentFilterDatePosted = useSearchStore(
    (state) => state.search[searchScreenKey]?.tempFilter?.datePosted || {},
  );
  const { startDate, endDate } = currentFilterDatePosted;

  const onSelectDate = (
    startDateSelected?: string,
    endDateSelected?: string,
  ) => {
    actionsSearchStore.updateTempFilterByScreenKey(searchScreenKey, {
      datePosted: {
        startDate: startDateSelected,
        endDate: endDateSelected,
      },
    });
  };

  const onReset = () => {
    actionsSearchStore.updateTempFilterByScreenKey(searchScreenKey, {
      datePosted: undefined,
    });
  };

  return (
    <SectionContainer title="search:filter_date_posted" onReset={!isEmpty(currentFilterDatePosted) && onReset}>
      <FilterDate
        startDate={startDate}
        endDate={endDate}
        onSelect={onSelectDate}
      />
    </SectionContainer>
  );
};

export default SearchFilterDatePostedSection;
