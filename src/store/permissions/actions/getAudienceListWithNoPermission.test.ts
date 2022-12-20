import { postAudience } from '~/test/mock_data/audiences';
import { myPermissionsData } from '~/test/mock_data/myPermissions';
import { renderHook, act } from '~/test/testUtils';
import useMyPermissionsStore, { IMyPermissionsState } from '../index';

describe('getAudienceListWithNoPermission', () => {
  it('should return empty array when input audience is not valid', () => {
    const requiredPermissions = 'edit_post_setting';
    const { result } = renderHook(() => useMyPermissionsStore((state) => state));

    act(() => {
      const output = result.current.actions.getAudienceListWithNoPermission(
        undefined,
        requiredPermissions,
      );
      expect(output).toEqual([]);
    });
  });

  it('should return array of audience with no permissions', () => {
    /**
     * the second data in postAudience doesn't have 'edit_post_setting' permission,
     * so the return array should be the second one - postAudience[1]
     */

    const requiredPermissions = 'edit_post_setting';
    useMyPermissionsStore.setState((state: IMyPermissionsState) => {
      state.data = myPermissionsData;
      return state;
    });

    const { result } = renderHook(() => useMyPermissionsStore((state) => state));

    act(() => {
      const output = result.current.actions.getAudienceListWithNoPermission(
        postAudience,
        requiredPermissions,
      );
      expect(output).toEqual([postAudience[1]]);
    });
  });

  it('should return empty array of audience with no permissions', () => {
    /**
     * all data in postAudience have 'send_message' permission
     * so the return array should be empty
     */

    const requiredPermissions = 'send_message';
    useMyPermissionsStore.setState((state: IMyPermissionsState) => {
      state.data = myPermissionsData;
      return state;
    });

    const { result } = renderHook(() => useMyPermissionsStore((state) => state));

    act(() => {
      const output = result.current.actions.getAudienceListWithNoPermission(
        postAudience,
        requiredPermissions,
      );
      expect(output).toEqual([]);
    });
  });

  it('should return full array of 3 audience with no permissions', () => {
    /**
     * all data in postAudience don't have 'order_move_group_structure' permission
     * so the return array should contain all 3 of them.
     */

    const requiredPermissions = 'order_move_group_structure';
    useMyPermissionsStore.setState((state: IMyPermissionsState) => {
      state.data = myPermissionsData;
      return state;
    });

    const { result } = renderHook(() => useMyPermissionsStore((state) => state));

    act(() => {
      const output = result.current.actions.getAudienceListWithNoPermission(
        postAudience,
        requiredPermissions,
      );
      expect(output).toEqual(postAudience);
    });
  });
});
