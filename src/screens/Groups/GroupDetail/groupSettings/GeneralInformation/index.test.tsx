import React from 'react';
import MockedNavigator from '~/test/MockedNavigator';
import {groupDetailData} from '~/test/mock_data/group';
import {renderWithRedux} from '~/test/testUtils';
import GeneralInformation from '.';

describe('GeneralInformation component', () => {
  const component = () => (
    <GeneralInformation route={{params: {groupId: groupDetailData.group.id}}} />
  );

  it('renders correctly', () => {
    const rendered = renderWithRedux(<MockedNavigator component={component} />);
    expect(rendered).toMatchSnapshot();
  });
});
