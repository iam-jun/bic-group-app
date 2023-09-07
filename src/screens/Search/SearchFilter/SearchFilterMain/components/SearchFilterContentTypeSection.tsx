import React, { FC } from 'react';
import { View } from 'react-native';
import { spacing } from '~/theme';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import { PostType } from '~/interfaces/IPost';
import { CheckBox } from '~/baseComponents';
import useSearchStore from '~/screens/Search/store';
import SectionContainer from './SectionContainer';

type SearchFilterContentTypeSectionProps = {
  searchScreenKey: string;
};

type ContentTypeOption = {
  id: number;
  name: PostType;
  label: string;
};

const data: ContentTypeOption[] = [
  {
    id: 1,
    name: PostType.POST,
    label: 'search:filter_post',
  },
  {
    id: 2,
    name: PostType.ARTICLE,
    label: 'search:filter_article',
  },
  {
    id: 3,
    name: PostType.SERIES,
    label: 'search:filter_series',
  },
];

const SearchFilterContentTypeSection: FC<SearchFilterContentTypeSectionProps> = ({
  searchScreenKey,
}) => {
  const actionsSearchStore = useSearchStore((state) => state.actions);
  const currentFilterContentType = useSearchStore(
    (state) => state.search[searchScreenKey]?.tempFilter?.contentType || [],
  );

  const onPressContentTypeOption
    = (contentTypeOption: ContentTypeOption) => (isChecked?: boolean) => {
      let newChoosenFilterContentType = [];
      if (isChecked) {
        newChoosenFilterContentType = [
          ...currentFilterContentType,
          contentTypeOption.name,
        ];
      } else {
        newChoosenFilterContentType = currentFilterContentType.filter(
          (currentFilterContentTypeOption) => currentFilterContentTypeOption !== contentTypeOption.name,
        );
      }

      actionsSearchStore.updateTempFilterByScreenKey(searchScreenKey, {
        contentType: newChoosenFilterContentType,
      });
    };

  const isChecked = ({ name }: ContentTypeOption) => currentFilterContentType.includes(name);

  const renderFilterContentType = () => data.map((item, index) => (
    <View key={`filter-content-type-${item.id}`}>
      <CheckBox isChecked={isChecked(item)} label={item.label} useI18n onPress={onPressContentTypeOption(item)} />
      {index < (data.length - 1) && <ViewSpacing height={spacing.margin.large} />}
    </View>
  ));

  return (
    <SectionContainer title="search:filter_content_type">
      {renderFilterContentType()}
    </SectionContainer>
  );
};

export default SearchFilterContentTypeSection;
