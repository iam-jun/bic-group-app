import { act, renderHook, waitFor } from '~/test/testUtils';
import usePinContent from '../index';

describe('updateGroupPinContent action', () => {
  it('given pinGroupIds vs unpinGroupIds should update groupPinContent', async () => {
    const { result } = renderHook(() => usePinContent((state) => state));
    usePinContent.setState((state) => ({
      ...state,
      groupPinContent: {
        123: {
          isLoading: false,
          data: [],
        },
        456: {
          isLoading: false,
          data: ['789'],
        },
      },
    }));

    act(() => {
      result.current.actions.updateGroupPinContent({ postId: '789', pinGroupIds: ['123'], unpinGroupIds: ['456'] });
    });

    await waitFor(() => {
      const { groupPinContent } = result.current;
      expect(groupPinContent['123'].data.length).toBe(1);
      expect(groupPinContent['456'].data.length).toBe(0);
    });
  });
});
