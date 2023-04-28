import React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import ReportContent from '.';
import { TargetType, ReportTo } from '~/interfaces/IReport';
import useModalStore from '~/store/modal';
import useBlockingStore from '~/store/blocking';

describe('ReportContent component', () => {
  const baseProps = {
    targetId: 'ec383429-e870-4ad3-9322-9857b4bb4769',
    groupIds: ['b01fb58e-9299-4a0e-a55f-9839293fb42a'],
    targetType: TargetType.COMMENT,
    reportTo: ReportTo.COMMUNITY,
    dataReportMember: {
      communityId: 'test',
      userId: 'test',
      reportedMember: { fullname: 'test' },
    },
  };

  it('renders correctly', () => {
    const hideModal = jest.fn();
    useModalStore.setState((state) => {
      state.actions.hideModal = hideModal;
      return state;
    });

    useBlockingStore.setState((state) => {
      state.listRelationship = [baseProps.targetId];
      return state;
    });

    const rendered = renderWithRedux(<ReportContent {...baseProps} />);
    const { getByTestId } = rendered;
    const component = getByTestId('report_content');
    expect(component).toBeDefined();

    const btnBack = getByTestId('report_content.btn_back');
    fireEvent.press(btnBack);
    expect(hideModal).toBeCalled();
  });
});
