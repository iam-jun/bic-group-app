import * as React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react-native';

import { cloneDeep } from 'lodash';
import OptionsWhoCanJoin, { IdType } from './OptionsWhoCanJoin';
import { groupDetailData } from '~/test/mock_data/communities';
import { GroupPrivacyType } from '~/constants/privacyTypes';

afterEach(cleanup);

describe('OptionsWhoCanJoin component', () => {
  const props = {
    data: groupDetailData.group,
    updateJoinSetting: jest.fn(),
  };

  it('renders correctly', () => {
    const propsClone = cloneDeep(props);
    propsClone.data.privacy = GroupPrivacyType.OPEN;

    const rendered = render(<OptionsWhoCanJoin {...propsClone} />);

    const { getByTestId } = rendered;
    const containerView = getByTestId('options_who_can_join');
    expect(containerView).toBeDefined();

    const radio = getByTestId(`options_who_can_join.raido_${IdType.ONLY_INVITED_PEOPLE}`);
    fireEvent.press(radio);
    expect(propsClone.updateJoinSetting).toHaveBeenCalled();
  });
});
