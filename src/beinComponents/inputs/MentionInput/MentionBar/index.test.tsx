import React from 'react';
import { cleanup } from '@testing-library/react-native';

import { renderWithRedux, fireEvent } from '~/test/testUtils';
import MentionBar from '.';
import useMentionInputStore from '../store';

afterEach(cleanup);

describe('MentionBar component', () => {
  const dataMention = {
    avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/static/user/default-avatar.png',
    fullname: 'Acc phụ của Ngọc Linh',
    id: '471058b7-51ab-4b02-93c4-25b9f682866b',
    isDeactivated: false,
    username: 'ngoclinh1',
  };

  it('renders correctly', async () => {
    const wrapper = renderWithRedux(<MentionBar />);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('renders null', async () => {
    const wrapper = renderWithRedux(<MentionBar />);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should show "MentionBar" in horizontal', async () => {
    useMentionInputStore.setState((state) => {
      state.data = [dataMention];
      return state;
    });

    const wrapper = renderWithRedux(<MentionBar />);
    const component = wrapper.getByTestId('mention_bar.list');

    expect(component).not.toBeNull();

    expect(component.props.horizontal).toBeTruthy();
    expect(component.props.showsHorizontalScrollIndicator).toBeFalsy();
  });

  it('should call onCompleteMention when press item', async () => {
    const onCompleteMentionMock = jest.fn();

    useMentionInputStore.setState((state) => {
      state.data = [dataMention];
      return state;
    });

    const wrapper = renderWithRedux(
      <MentionBar
        onCompleteMention={onCompleteMentionMock}
      />,
    );
    const item = wrapper.getByTestId('mention_bar.item');

    expect(item).not.toBeNull();
    fireEvent.press(item);

    expect(onCompleteMentionMock).toBeCalled();
  });
});
