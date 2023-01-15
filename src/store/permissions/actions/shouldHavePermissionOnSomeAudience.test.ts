import { renderHook, act } from '~/test/testUtils';
import { postAudience } from '~/test/mock_data/audiences';
import useMyPermissionsStore, { IMyPermissionsState } from '../index';
import { myPermissionsData } from '~/test/mock_data/myPermissions';

describe('shouldHavePermissionOnSomeAudience', () => {
  const requiredPermissions = 'crud_post_article';

  it('should return true if there is one audience that user has the required permission on', () => {
    useMyPermissionsStore.setState((state: IMyPermissionsState) => {
      state.data = myPermissionsData;
      return state;
    });

    const { result } = renderHook(() => useMyPermissionsStore((state) => state));

    act(() => {
      const output = result.current.actions.shouldHavePermissionOnSomeAudience(
        postAudience,
        requiredPermissions,
      );
      expect(output).toBe(true);
    });
  });

  it('should return false if there is NO audience that user has the required permission on', () => {
    useMyPermissionsStore.setState((state: IMyPermissionsState) => {
      state.data = {
        ...myPermissionsData,
        groups: {
          ...myPermissionsData.groups,
          'f67e9053-8490-4264-9fbb-47bd53a7fa5c': [
            'send_message',
            'edit_own_message',
            'delete_own_message',
            'crud_uc',
          ],
          '0f5c4bb8-323b-41ee-8aed-b064fecf492b': [
            'invite_member',
            'assign_unassign_role',
            'edit_join_setting',
            'edit_info',
          ],
        },
      };
      return state;
    });

    const { result } = renderHook(() => useMyPermissionsStore((state) => state));

    act(() => {
      const output = result.current.actions.shouldHavePermissionOnSomeAudience(
        postAudience,
        requiredPermissions,
      );
      expect(output).toBe(false);
    });
  });

  it('should return false if input audience is not valid', () => {
    useMyPermissionsStore.setState((state: IMyPermissionsState) => {
      state.data = myPermissionsData;
      return state;
    });

    const { result } = renderHook(() => useMyPermissionsStore((state) => state));

    act(() => {
      const output = result.current.actions.shouldHavePermissionOnSomeAudience(
        undefined,
        requiredPermissions,
      );
      expect(output).toBe(false);
    });
  });
});
