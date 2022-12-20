import { renderHook, act } from '~/test/testUtils';
import { myPermissionsData } from '~/test/mock_data/myPermissions';
import useMyPermissionsStore, { IMyPermissionsState } from '../index';

describe('shouldHavePermission', () => {
  const id = '0b69fb1e-51b4-4e3b-ad38-7afec387203c';

  it('should return true when have 1 required permission', () => {
    useMyPermissionsStore.setState((state: IMyPermissionsState) => {
      state.data = myPermissionsData;
      return state;
    });

    const requiredPermissions = 'add_member';

    const { result } = renderHook(() => useMyPermissionsStore((state) => state));

    act(() => {
      const output = result.current.actions.shouldHavePermission(id, requiredPermissions);
      expect(output).toBe(true);
    });
  });

  it('should return false when not have 1 required permission', () => {
    useMyPermissionsStore.setState((state: IMyPermissionsState) => {
      state.data = myPermissionsData;
      return state;
    });

    const requiredPermissions = 'edit_privacy';

    const { result } = renderHook(() => useMyPermissionsStore((state) => state));

    act(() => {
      const output = result.current.actions.shouldHavePermission(id, requiredPermissions);
      expect(output).toBe(false);
    });
  });

  it('should return true when have all multiple required permissions', () => {
    useMyPermissionsStore.setState((state: IMyPermissionsState) => {
      state.data = myPermissionsData;
      return state;
    });

    const requiredPermissions = ['add_member', 'edit_post_setting', 'send_message'];

    const { result } = renderHook(() => useMyPermissionsStore((state) => state));

    act(() => {
      const output = result.current.actions.shouldHavePermission(id, requiredPermissions);
      expect(output).toBe(true);
    });
  });

  it('should return true when have at least 1 required permission', () => {
    useMyPermissionsStore.setState((state: IMyPermissionsState) => {
      state.data = myPermissionsData;
      return state;
    });

    const requiredPermissions = ['add_member', 'edit_privacy', 'create_custom_emoji'];

    const { result } = renderHook(() => useMyPermissionsStore((state) => state));

    act(() => {
      const output = result.current.actions.shouldHavePermission(id, requiredPermissions);
      expect(output).toBe(true);
    });
  });

  it('should return false when have no required permissions', () => {
    useMyPermissionsStore.setState((state: IMyPermissionsState) => {
      state.data = myPermissionsData;
      return state;
    });

    const requiredPermissions = ['channel_mentions', 'edit_privacy'];

    const { result } = renderHook(() => useMyPermissionsStore((state) => state));

    act(() => {
      const output = result.current.actions.shouldHavePermission(id, requiredPermissions);
      expect(output).toBe(false);
    });
  });

  it('should return false when input id param is not valid', () => {
    useMyPermissionsStore.setState((state: IMyPermissionsState) => {
      state.data = myPermissionsData;
      return state;
    });

    const requiredPermissions = 'channel_mentions';

    const { result } = renderHook(() => useMyPermissionsStore((state) => state));

    act(() => {
      const output = result.current.actions.shouldHavePermission(undefined, requiredPermissions);
      expect(output).toBe(false);
    });
  });
});
