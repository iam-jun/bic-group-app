import React from 'react';

import { renderWithRedux } from '~/test/testUtils';
import ToastAutoSave from './ToastAutoSave';

describe('ToastAutoSave component', () => {
  it('should render correctly', () => {
    const wrapper = renderWithRedux(<ToastAutoSave visible />);

    expect(wrapper).toMatchSnapshot();
  });
});
