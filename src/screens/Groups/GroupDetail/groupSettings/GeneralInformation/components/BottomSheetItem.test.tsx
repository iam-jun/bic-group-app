import React from 'react';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import initialState from '~/store/initialState';
import {configureStore, fireEvent, renderWithRedux} from '~/test/testUtils';
import BottomSheetItem from './BottomSheetItem';

describe('BottomSheetItem component', () => {
  const baseProps = {
    item: {
      type: 'PUBLIC',
      title: 'Test Title',
      subtitle: 'Test Subtitle',
      groupTitle: 'Test Group Title',
      icon: 'Globe',
    },
    onPressHelpMessage: jest.fn(),
  };

  const mockStore = configureStore([]);

  const storeData = {...initialState};

  it('renders correctly', () => {
    const store = mockStore(storeData);
    const rendered = renderWithRedux(
      <BottomSheetItem {...baseProps} />,
      store,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`should show correct name`, () => {
    storeData.groups.groupDetail.group.name = 'test';
    const store = mockStore(storeData);

    const rendered = renderWithRedux(<BottomSheetItem {...baseProps} />, store);
    const component = rendered.getByTestId('group_info_view.name');
    const itemComponent = component.findByType(PrimaryItem);

    expect(itemComponent.props.subTitle).toBe('test');
  });

  it(`should call onPressPrivacy when privacy button press`, () => {
    storeData.groups.loadingCover = false;
    const store = mockStore(storeData);

    const onPressPrivacy = jest.fn();

    const props = {
      ...baseProps,
      onPressPrivacy,
    };

    const rendered = renderWithRedux(<BottomSheetItem {...props} />, store);
    const component = rendered.getByTestId('group_info_view.privacy');

    fireEvent.press(component);

    expect(onPressPrivacy).toBeCalled();
  });
});
