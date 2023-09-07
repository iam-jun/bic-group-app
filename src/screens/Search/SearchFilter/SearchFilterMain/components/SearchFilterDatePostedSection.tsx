import React, { FC } from 'react';
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

  return (
    <SectionContainer title="search:filter_date_posted">
      <FilterDate
        startDate={startDate}
        endDate={endDate}
        onSelect={onSelectDate}
      />
    </SectionContainer>
  );
};

export default SearchFilterDatePostedSection;
