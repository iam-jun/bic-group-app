import { act } from '@testing-library/react-hooks';
import * as React from 'react';
import useTagsStore from '~/store/entities/tags';
import { mockTags } from '~/test/mock_data/tags';
import { renderHook, renderWithRedux } from '~/test/testUtils';
import TagItem from './TagItem';

describe('TagItem component', () => {
  it('given canCUDTag & tag has totalUsed = 0, should render menu', () => {
    const { result: resultUseTagsStore } = renderHook(() => useTagsStore());

    act(() => {
      resultUseTagsStore.current.actions.addTags(mockTags);
    });

    const wrapper = renderWithRedux(<TagItem canCUDTag isMember item={resultUseTagsStore.current.tags['2']} communityId="1" />);
    const tagMenu = wrapper.queryByTestId('tag_menu');
    expect(tagMenu).not.toBeNull();
  });

  it('given canCUDTag & tag has totalUsed > 0, should not render menu', () => {
    const { result: resultUseTagsStore } = renderHook(() => useTagsStore());

    act(() => {
      resultUseTagsStore.current.actions.addTags(mockTags);
    });

    const wrapper = renderWithRedux(<TagItem canCUDTag isMember item={resultUseTagsStore.current.tags['1']} communityId="1" />);
    const tagMenu = wrapper.queryByTestId('tag_menu');
    expect(tagMenu).toBeNull();
  });

  it('given canCUDTag = false, should not render menu', () => {
    const { result: resultUseTagsStore } = renderHook(() => useTagsStore());

    act(() => {
      resultUseTagsStore.current.actions.addTags(mockTags);
    });

    const wrapper = renderWithRedux(<TagItem canCUDTag={false} isMember={false} item={resultUseTagsStore.current.tags['1']} communityId="1" />);
    const tagMenu = wrapper.queryByTestId('tag_menu');
    expect(tagMenu).toBeNull();
  });
});
