import * as React from 'react';
import { act, renderHook, renderWithRedux } from '~/test/testUtils';
import ChooseSeriesAudience from '.';
import { audiencesTree } from '~/test/mock_data/audiences';
import groupApi from '~/api/GroupApi';
import MockedNavigator from '~/test/MockedNavigator';
import useSelectAudienceStore from '~/components/SelectAudience/store';

describe('CreateSeries component', () => {
  it('renders correctly if this is first step in create series', () => {
    const response = {
      code: 200,
      data: audiencesTree,
      meta: {},
    };

    const spyApiGetAudienceTree = jest.spyOn(groupApi, 'getAudienceTree').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    jest.useFakeTimers();

    const { result: audienceStoreResult } = renderHook(() => useSelectAudienceStore());

    act(() => {
      audienceStoreResult.current.actions.getAudienceTree();
    });

    const component = () => (
      <ChooseSeriesAudience route={{ params: { isFirstStep: true } }} />
    );

    const wrapper = renderWithRedux(<MockedNavigator component={component} />);
    expect(wrapper.toJSON()).toMatchSnapshot();

    act(() => {
      jest.runAllTimers();
    });

    expect(spyApiGetAudienceTree).toBeCalled();
  });
});
