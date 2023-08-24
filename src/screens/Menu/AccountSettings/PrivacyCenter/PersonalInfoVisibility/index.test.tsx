import React from 'react';

import { fireEvent, languages, renderWithRedux } from '~/test/testUtils';
import MockedNavigator from '~/test/MockedNavigator';
import PersonalInfoVisibility from './index';
import { PERSONAL_INFORMATION_VISIBILITY_TYPES } from '~/constants/privacyCenter';

describe('PersonalInfoVisibility', () => {
  it('should render correctly', () => {
    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <PersonalInfoVisibility />
        )}
      />,
    );

    const headerTitle = wrapper.getByTestId('header.text');
    expect(headerTitle.props.children).toBe(languages.settings.privacy_center.personal_information_visibility.title);

    const optionItemComponents = wrapper.getAllByTestId('personal_information_visibility.raido');
    expect(optionItemComponents.length).toEqual(PERSONAL_INFORMATION_VISIBILITY_TYPES.length);

    fireEvent.press(optionItemComponents[0]);
  });
});
