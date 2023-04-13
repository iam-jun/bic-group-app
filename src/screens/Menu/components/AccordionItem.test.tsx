import React from 'react';
import { render } from '~/test/testUtils';
import AccordionItem from './AccordionItem';
import { SettingsAndPrivacyType } from '~/interfaces/IMenu';

describe('AccordionMenu component', () => {
  const props = {
    data: {
      type: SettingsAndPrivacyType.SECURITY,
      title: 'settings:title_security',
      icon: 0,
      onPress: jest.fn(),
    },
    height: 48,
  };

  it('should render props correctly', () => {
    const rendered = render(<AccordionItem {...props} />);

    const { getByTestId } = rendered;
    const containerComponent = getByTestId(`accordion_item_${props.data.type}`);
    expect(containerComponent).toBeDefined();
  });
});
