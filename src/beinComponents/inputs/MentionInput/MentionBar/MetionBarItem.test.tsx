import { cleanup, fireEvent } from '@testing-library/react-native';
import React from 'react';
import initialState from '~/storeRedux/initialState';
import { configureStore, renderWithRedux } from '~/test/testUtils';
import MentionBarItem from './MentionBarItem';

afterEach(cleanup);

describe('MentionBarItem component', () => {
  const baseProps = {
    data: {
      id: '1',
      username: 'test',
      fullname: 'test',
      avatar: 'test',
    },
  };

  const mockStore = configureStore([]);

  it('renders correctly', async () => {
    const store = mockStore(initialState);
    const wrapper = renderWithRedux(<MentionBarItem {...baseProps} />, store);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should show "MentionBarItem" and onPress should be called', async () => {
    const store = mockStore(initialState);
    const onPress = jest.fn();
    const props = { ...baseProps, onPress };
    const wrapper = renderWithRedux(<MentionBarItem {...props} />, store);
    const component = wrapper.getByTestId('mention_bar_item');
    fireEvent.press(component);

    expect(onPress).toHaveBeenCalledWith(baseProps.data);
  });

  it('should show "MentionBarItem" with Avatar', async () => {
    const store = mockStore(initialState);
    const wrapper = renderWithRedux(<MentionBarItem {...baseProps} />, store);
    const component = wrapper.getByTestId('mention_bar_item.avatar');

    expect(component).not.toBeNull();
  });

  it('should show "MentionBarItem" with name', async () => {
    const store = mockStore(initialState);
    const wrapper = renderWithRedux(<MentionBarItem {...baseProps} />, store);
    const component = wrapper.getByTestId('mention_bar_item.name');

    expect(component).not.toBeNull();
    expect(component.props.children).toBe(baseProps.data.fullname);
  });
});
