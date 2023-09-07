import { isEqual, sortBy } from 'lodash';
import { ISearchState } from '..';
import { ISearchUser, ITagSearch } from '~/interfaces/ISearch';
import { isDiffBetweenTwoArraysByProperty } from '~/helpers/common';
import { ICategory } from '~/interfaces/IArticle';

const isFilterChangedByScreenKey = (_set, get) => (screenKey: string) => {
  const { search }: ISearchState = get();
  const { filter, tempFilter } = search[screenKey] || {};

  if (!filter || !tempFilter) return false;

  const {
    contentType = [],
    group,
    tags = [],
    topics = [],
    createdBy = [],
    datePosted,
  } = filter;
  const {
    contentType: tempFilterContentType = [],
    group: tempFilterGroup,
    tags: tempFilterTags = [],
    topics: tempFilterTopics = [],
    createdBy: tempFilterCreatedBy = [],
    datePosted: tempFilterDatePosted,
  } = tempFilter;

  const isFilterContentTypeChanged = !isEqual(
    sortBy(contentType),
    sortBy(tempFilterContentType),
  );
  const isFilterGroupChanged = group?.id !== tempFilterGroup?.id;
  const isFilterTagsChanged = isDiffBetweenTwoArraysByProperty<ITagSearch>(
    'name',
    tags,
    tempFilterTags,
  );
  const isFilterTopicsChanged = isDiffBetweenTwoArraysByProperty<ICategory>(
    'id',
    topics,
    tempFilterTopics,
  );
  const isFilterUsersChanged
        = isDiffBetweenTwoArraysByProperty<ISearchUser>(
          'id',
          createdBy,
          tempFilterCreatedBy,
        );
  const isFilterDatePostedChanged = !isEqual(
    datePosted,
    tempFilterDatePosted,
  );

  return (
    isFilterContentTypeChanged
        || isFilterGroupChanged
        || isFilterTagsChanged
        || isFilterTopicsChanged
        || isFilterUsersChanged
        || isFilterDatePostedChanged
  );
};

export default isFilterChangedByScreenKey;
