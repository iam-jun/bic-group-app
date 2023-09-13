import React from 'react';

import { fireEvent, languages, renderWithRedux } from '~/test/testUtils';
import MockedNavigator from '~/test/MockedNavigator';
import InvitationPrivacy from './index';
import { INVITATION_PRIVACY_TYPES } from '~/constants/privacyCenter';

describe('InvitationPrivacy', () => {
  it('should render correctly', () => {
    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <InvitationPrivacy />
        )}
      />,
    );

    const headerTitle = wrapper.getByTestId('header.text');
    expect(headerTitle.props.children).toBe(languages.settings.privacy_center.invitation_privacy.title);

    const optionItemComponents = wrapper.getAllByTestId('invitation_privacy.raido');
    expect(optionItemComponents.length).toEqual(INVITATION_PRIVACY_TYPES.length);

    fireEvent.press(optionItemComponents[0]);
  });
});
