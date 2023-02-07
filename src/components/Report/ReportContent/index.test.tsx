import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import ReportReasons from '.';
import { TargetType, IPayloadReportContent, ReportTo } from '~/interfaces/IReport';

describe('ReportContent component', () => {
  const baseProps = {
    targetId: 'ec383429-e870-4ad3-9322-9857b4bb4769',
    groupIds: [
      'b01fb58e-9299-4a0e-a55f-9839293fb42a',
    ],
    targetType: TargetType.COMMENT,
    reportTo: ReportTo.COMMUNITY,
  } as IPayloadReportContent;

  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <ReportReasons
        {...baseProps}
      />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
