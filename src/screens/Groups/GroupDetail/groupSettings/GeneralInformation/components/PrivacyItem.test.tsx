import React from 'react';
import initialState from '~/store/initialState';
import {configureStore, fireEvent, renderWithRedux} from '~/test/testUtils';
import PrivacyItem from './PrivacyItem';

describe('PrivacyItem component', () => {
  const baseProps = {
    item: {
      type: 'PUBLIC',
      title: 'Test Title',
      subtitle: 'Test Subtitle',
      privacyTitle: 'Test Group Title',
      icon: 'Globe',
    },
    onPressHelpMessage: jest.fn(),
  };

  const mockStore = configureStore([]);

  const storeData = {...initialState};

  it('renders correctly', () => {
    const store = mockStore(storeData);
    const rendered = renderWithRedux(
      <PrivacyItem {...baseProps} />,
      store,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`should show RightComponent`, () => {
    storeData.groups.groupDetail.group.privacy = 'PUBLIC';
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<PrivacyItem {...baseProps} />, store);
    const component = rendered.getByTestId(
      `general_information.privacy.${baseProps.item.type}`.toLowerCase(),
    );
    const itemComponent = component.findByProps({icon: 'Check'});

    expect(itemComponent.instance).toBeDefined();
  });

  it(`should hide RightComponent`, () => {
    storeData.groups.groupDetail.group.privacy = 'PRIVATE';
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<PrivacyItem {...baseProps} />, store);
    const component = rendered.getByTestId(
      `general_information.privacy.${baseProps.item.type}`.toLowerCase(),
    );

    expect(component.props.RightComponent).not.toBeDefined();
  });

  it(`should call onPressPrivacy when privacy button press`, () => {
    storeData.groups.loadingCover = false;
    const store = mockStore(storeData);

    const onPressHelpMessage = jest.fn();

    const props = {
      ...baseProps,
      onPressHelpMessage,
    };

    const rendered = renderWithRedux(<PrivacyItem {...props} />, store);
    const component = rendered.getByTestId(
      `general_information.privacy.${baseProps.item.type}`.toLowerCase(),
    );

    const itemComponent = component.findByProps({
      children: 'settings:text_learn_more',
    });

    fireEvent.press(itemComponent);

    expect(onPressHelpMessage).toBeCalled();
  });
});
