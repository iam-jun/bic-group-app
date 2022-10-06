import React from 'react';

import SchemeItem from './SchemeItem';
import { renderWithRedux, fireEvent } from '~/test/testUtils';
import * as navigationHook from '../../../hooks/navigation';
import groupStack from '../../../router/navigator/MainStack/stacks/groupStack/stack';
import { groupScheme } from '~/test/mock_data/scheme';

describe('SchemeItem component', () => {
  const communityId = '1';
  it('should render data correctly', () => {
    const item = { ...groupScheme };
    const wrapper = renderWithRedux(<SchemeItem communityId={communityId} item={item} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should NOT display text Activated when there is no applying groups', () => {
    const item = { ...groupScheme, applyingGroups: [] };
    const wrapper = renderWithRedux(<SchemeItem communityId={communityId} item={item} />);
    const textBadge = wrapper.queryByTestId('text_badge');
    expect(textBadge).toBeNull();
  });

  it('should NOT display applying group list when there is no applying groups', () => {
    const item = { ...groupScheme, applyingGroups: [] };
    const wrapper = renderWithRedux(<SchemeItem communityId={communityId} item={item} />);
    const textBadge = wrapper.queryByTestId('scheme_item.group_list');
    expect(textBadge).toBeNull();
  });

  it('should navigate to edit group scheme screen when pressing button edit', () => {
    const item = { ...groupScheme };
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));
    const wrapper = renderWithRedux(<SchemeItem communityId={communityId} item={item} />);
    const btnEdit = wrapper.getByTestId('scheme_item.btn_edit');
    fireEvent.press(btnEdit);
    expect(navigate).toBeCalledWith(groupStack.createPermissionScheme, {
      isEdit: true,
      initScheme: item,
      schemeId: item.id,
    });
  });
});
