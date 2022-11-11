import * as React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import ChosenAudiences from './ChosenAudiences';

describe('ChosenAudiences component', () => {
  const audience = { count: 2, names: 'audience 1, audience 2' };

  it('render correctly', () => {
    const handlePressAudiences = jest.fn();
    const wrapper = renderWithRedux(<ChosenAudiences
      audiences={audience}
      onPressAudiences={handlePressAudiences}
    />);
    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('should call onPressAudiences when click component', () => {
    const handlePressAudiences = jest.fn();
    const wrapper = renderWithRedux(<ChosenAudiences
      audiences={audience}
      onPressAudiences={handlePressAudiences}
    />);

    const component = wrapper.getByTestId('create_post_chosen_audiences');
    expect(component).toBeDefined();

    fireEvent.press(component);
    expect(handlePressAudiences).toBeCalled();
  });

  it('render correctly when audiences is empty', () => {
    const handlePressAudiences = jest.fn();
    const wrapper = renderWithRedux(<ChosenAudiences
      audiences={{}}
      onPressAudiences={handlePressAudiences}
    />);
    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('should disabled component when prop disabled = true', () => {
    const handlePressAudiences = jest.fn();
    const wrapper = renderWithRedux(<ChosenAudiences
      audiences={audience}
      onPressAudiences={handlePressAudiences}
      disabled
    />);
    expect(wrapper.toJSON()).toMatchSnapshot();

    const component = wrapper.getByTestId('create_post_chosen_audiences');
    expect(component).toBeDefined();

    fireEvent.press(component);
    expect(handlePressAudiences).toBeCalledTimes(0);
  });
});
