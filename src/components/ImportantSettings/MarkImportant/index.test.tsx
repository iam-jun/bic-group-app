import * as React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import MarkImportant from './index';
import { postAudience } from '~/test/mock_data/audiences';

describe('MarkImportant component', () => {
  const onPressAudiences: any = jest.fn();
  const handleToggleImportant: any = jest.fn();
  const handleDropDown: any = jest.fn();
  const getMinDate: any = jest.fn();
  const getMaxDate: any = jest.fn();
  const handleChangeDatePicker: any = jest.fn();
  const handleChangeTimePicker: any = jest.fn();

  it('should render correctly', () => {
    const rendered = renderWithRedux(
      <MarkImportant
        type="article"
        dataImportant={{
          active: true,
          expiresTime: '2023-03-15T09:28:27.806Z',
          chosenSuggestedTime: '6 months',
          neverExpires: false,
        }}
        showWarning={false}
        onPressAudiences={onPressAudiences}
        listAudiencesWithoutPermission={[]}
        handleToggleImportant={handleToggleImportant}
        handleDropDown={handleDropDown}
        showCustomExpire={false}
        getMinDate={getMinDate}
        getMaxDate={getMaxDate}
        handleChangeDatePicker={handleChangeDatePicker}
        handleChangeTimePicker={handleChangeDatePicker}
      />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should render show warning and show list audiences with no permission', () => {
    const rendered = renderWithRedux(
      <MarkImportant
        type="article"
        dataImportant={{
          active: true,
          expiresTime: '2023-03-15T09:28:27.806Z',
          chosenSuggestedTime: '6 months',
          neverExpires: false,
        }}
        showWarning
        onPressAudiences={onPressAudiences}
        listAudiencesWithoutPermission={postAudience}
        handleToggleImportant={handleToggleImportant}
        handleDropDown={handleDropDown}
        showCustomExpire={false}
        getMinDate={getMinDate}
        getMaxDate={getMaxDate}
        handleChangeDatePicker={handleChangeDatePicker}
        handleChangeTimePicker={handleChangeTimePicker}
      />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should render correctly when active = false', () => {
    const rendered = renderWithRedux(
      <MarkImportant
        type="article"
        dataImportant={{
          active: false,
          expiresTime: null,
          chosenSuggestedTime: '',
          neverExpires: false,
        }}
        showWarning={false}
        onPressAudiences={onPressAudiences}
        listAudiencesWithoutPermission={[]}
        handleToggleImportant={handleToggleImportant}
        handleDropDown={handleDropDown}
        showCustomExpire={false}
        getMinDate={getMinDate}
        getMaxDate={getMaxDate}
        handleChangeDatePicker={handleChangeDatePicker}
        handleChangeTimePicker={handleChangeTimePicker}
      />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
