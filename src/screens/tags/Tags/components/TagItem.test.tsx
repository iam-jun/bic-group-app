import { act } from '@testing-library/react-hooks';
import * as React from 'react';
import useTagsStore from '~/store/entities/tags';
import { mockTags } from '~/test/mock_data/tags';
import { renderHook, renderWithRedux } from '~/test/testUtils';
import TagItem from './TagItem';

describe('TagItem component', () => {
  it('given isMember & tag has totalUsed = 0, should render menu', () => {
    const { result: resultUseTagsStore } = renderHook(() => useTagsStore());

    act(() => {
      resultUseTagsStore.current.actions.addTags(mockTags);
    });

    const wrapper = renderWithRedux(<TagItem isMember item={resultUseTagsStore.current.tags['2']} communityId="1" communityName="" />);
    const tagMenu = wrapper.queryByTestId('tag_menu');
    expect(tagMenu).toBeDefined();
  });

  it('given isMember & tag has totalUsed > 0, should not render menu', () => {
    const { result: resultUseTagsStore } = renderHook(() => useTagsStore());

    act(() => {
      resultUseTagsStore.current.actions.addTags(mockTags);
    });

    const wrapper = renderWithRedux(<TagItem isMember item={resultUseTagsStore.current.tags['1']} communityId="1" communityName="" />);
    const tagMenu = wrapper.queryByTestId('tag_menu');
    expect(tagMenu).toBeNull();
  });

  it('given isMember = false, should not render menu', () => {
    const { result: resultUseTagsStore } = renderHook(() => useTagsStore());

    act(() => {
      resultUseTagsStore.current.actions.addTags(mockTags);
    });

    const wrapper = renderWithRedux(<TagItem isMember={false} item={resultUseTagsStore.current.tags['1']} communityId="1" communityName="" />);
    const tagMenu = wrapper.queryByTestId('tag_menu');
    expect(tagMenu).toBeNull();
  });
});
