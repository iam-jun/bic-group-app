import React from 'react';
import { cleanup } from '@testing-library/react-native';

import { renderWithRedux, fireEvent } from '~/test/testUtils';
import AtMentionItem from './AtMentionItem';

afterEach(cleanup);

describe('AtMentionItem component', () => {
  const baseProps = {
    showSpectialItems: false,
    item: {
      username: 'test',
      name: 'test',
    },
    onPress: jest.fn(),
  };

  it('renders correctly', async () => {
    const wrapper = renderWithRedux(<AtMentionItem {...baseProps} />);

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should show "AtMentionItem" with item all', async () => {
    const props = {
      ...baseProps,
      showSpectialItems: true,
    };
    const wrapper = renderWithRedux(<AtMentionItem {...props} />);
    const component = wrapper.getByTestId('at_mention_item');

    expect(component).not.toBeNull();
  });

  it('should call "_onPressItem"', async () => {
    const onPress = jest.fn();
    const props = {
      ...baseProps,
      onPress,
    };
    const wrapper = renderWithRedux(<AtMentionItem {...props} />);
    const component = wrapper.getByTestId('at_mention_item.touchable');
    expect(component).not.toBeNull();
    fireEvent.press(component);
    expect(onPress).toBeCalled();
  });
});
