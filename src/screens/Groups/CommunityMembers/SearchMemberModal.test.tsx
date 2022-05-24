import i18next from 'i18next';
import React from 'react';
import {renderWithRedux} from '~/test/testUtils';
import SearchMemberModal from './SearchMemberModal';

describe('SearchMemberModal component', () => {
  const communityId = 1;
  const isOpen = true;

  it('should render Type search keyword description correctly', () => {
    const wrapper = renderWithRedux(
      <SearchMemberModal
        communityId={communityId}
        isOpen={isOpen}
        initSearch=""
      />,
    );
    const textComponent = wrapper.getByTestId(
      'search_member_modal.type_search',
    );
    expect(textComponent.props.children).toBe(
      i18next.t('common:text_type_search_keyword'),
    );
  });

  it('should render data list correctly', () => {
    const wrapper = renderWithRedux(
      <SearchMemberModal
        communityId={communityId}
        isOpen={isOpen}
        initSearch="test"
      />,
    );
    const textComponent = wrapper.queryByTestId(
      'search_member_modal.type_search',
    );
    expect(textComponent).toBeNull();

    const dataList = wrapper.queryByTestId('content_data.list');
    expect(dataList).toBeDefined();
  });
});
