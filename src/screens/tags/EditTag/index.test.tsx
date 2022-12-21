import * as React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import EditTag from '.';

describe('EditTag component', () => {
  it('render correctly with default state', () => {
    const wrapper = renderWithRedux(<EditTag route={{
      params: {
        tag: {
          id: '2',
          name: 'tag 2',
          slug: 'tag-2',
          totalUsed: 0,
          groupId: '1',
          createdBy: '',
          updatedBy: '',
        },
      },
    }}
    />);
    expect(wrapper).toMatchSnapshot();
  });
});
