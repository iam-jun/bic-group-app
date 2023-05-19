import React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import AudienceContent from './AudienceContent';
import { mockResponseFlatAudiences } from '~/test/mock_data/audiences';

describe('AudienceContent component', () => {
  it('should be pressable', () => {
    const shouldBeChecked = jest.fn();
    const onPress = jest.fn();
    const itemData = mockResponseFlatAudiences.data[0];

    const component = renderWithRedux(
      <AudienceContent
        item={itemData as any}
        onPress={onPress}
        shouldBeChecked={shouldBeChecked}
      />,
    );

    expect(shouldBeChecked).toBeCalled();

    const itemAudience = component.getByTestId('group_item.container');

    fireEvent.press(itemAudience);

    expect(onPress).toBeCalled();
  });

  it('should be check', () => {
    const shouldBeChecked = jest.fn().mockReturnValue(true);
    const onPress = jest.fn();
    const itemData = mockResponseFlatAudiences.data[0];

    const component = renderWithRedux(
      <AudienceContent
        item={itemData as any}
        onPress={onPress}
        shouldBeChecked={shouldBeChecked}
      />,
    );

    expect(component).toMatchSnapshot();
  });

  it('should be uncheck', () => {
    const shouldBeChecked = jest.fn().mockReturnValue(false);
    const onPress = jest.fn();
    const itemData = mockResponseFlatAudiences.data[0];

    const component = renderWithRedux(
      <AudienceContent
        item={itemData as any}
        onPress={onPress}
        shouldBeChecked={shouldBeChecked}
      />,
    );

    expect(component).toMatchSnapshot();
  });
});
