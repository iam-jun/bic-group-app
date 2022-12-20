import * as React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import CreateTag from './CreateTag';

describe('CreateTag component', () => {
  it('render correctly with default state', () => {
    const wrapper = renderWithRedux(<CreateTag communityId="" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should enable button when text change', async () => {
    const wrapper = renderWithRedux(<CreateTag communityId="" />);

    const createTagBtn = wrapper.getByTestId('create_tag_btn');
    const createTagInput = wrapper.getByTestId('create_tag_input');

    fireEvent.changeText(createTagInput, 'Tag name');
    expect(createTagBtn.props.disabled).toBeFalsy();
  });
});
