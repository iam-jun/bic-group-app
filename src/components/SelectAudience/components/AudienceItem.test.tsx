import React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import AudienceItem from './AudienceItem';
import { mockResponseFlatAudiences } from '~/test/mock_data/audiences';

describe('AudienceItem component', () => {
  it('should render correctly', () => {
    const shouldBeChecked = jest.fn();
    const onCheckboxPress = jest.fn();
    const itemData = mockResponseFlatAudiences.data[0];

    const component = renderWithRedux(
      <AudienceItem
        item={itemData as any}
        shouldBeChecked={shouldBeChecked}
        onCheckboxPress={onCheckboxPress}
      />,
    );

    expect(shouldBeChecked).toBeCalled();

    const itemAudience = component.getByTestId('group_item.container');

    fireEvent.press(itemAudience);

    expect(onCheckboxPress).toBeCalled();
  });
});
