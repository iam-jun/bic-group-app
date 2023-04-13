import React from 'react';
import { render } from '~/test/testUtils';
import AccordionMenu from './AccordionMenu';
import { SettingsAndPrivacyType } from '~/interfaces/IMenu';

describe('AccordionMenu component', () => {
  const props = {
    testID: 'test',
    icon: 0,
    title: 'test',
    listAccordion: [
      {
        type: SettingsAndPrivacyType.SECURITY,
        title: 'settings:title_security',
        icon: 0,
        onPress: jest.fn(),
      },
    ],
  };

  it('should render props correctly', () => {
    const rendered = render(<AccordionMenu {...props} />);

    const { getByTestId } = rendered;
    const containerComponent = getByTestId(props.testID);
    expect(containerComponent).toBeDefined();
  });
});
