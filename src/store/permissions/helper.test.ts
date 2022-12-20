import { myPermissionsData } from '~/test/mock_data/myPermissions';
import { checkIfHasPermission } from './helper';

/**
 * permission values are inside file src/constants/permissionScheme.ts
 */

describe('helper function', () => {
  const availablePermissions = myPermissionsData.groups['0b69fb1e-51b4-4e3b-ad38-7afec387203c'];

  it(`checkIfHasPermission should return false correctly when input
  available permissions is not valid`, () => {
    const requiredPermissions = 'add_member';
    const result = checkIfHasPermission(requiredPermissions, undefined);
    expect(result).toBe(false);
  });

  it(`checkIfHasPermission should return true correctly when current
  available permissions have the required permission`, () => {
    const requiredPermissions = 'add_member';
    const result = checkIfHasPermission(requiredPermissions, availablePermissions);
    expect(result).toBe(true);
  });

  it(`checkIfHasPermission should return false correctly when current
  available permissions do not have the required permission`, () => {
    const requiredPermissions = 'edit_privacy';
    const result = checkIfHasPermission(requiredPermissions, availablePermissions);
    expect(result).toBe(false);
  });

  it(`checkIfHasPermission should return true correctly when current
  available permissions have all required permissions`, () => {
    const requiredPermissions = ['add_member', 'edit_post_setting', 'send_message'];
    const result = checkIfHasPermission(requiredPermissions, availablePermissions);
    expect(result).toBe(true);
  });

  it(`checkIfHasPermission should return true correctly when current
  available permissions have at least 1 required permission`, () => {
    const requiredPermissions = ['add_member', 'edit_privacy', 'create_custom_emoji'];
    const result = checkIfHasPermission(requiredPermissions, availablePermissions);
    expect(result).toBe(true);
  });

  it(`checkIfHasPermission should return false correctly when current
  available permissions dont have any required permissions`, () => {
    const requiredPermissions = ['channel_mentions', 'edit_privacy'];
    const result = checkIfHasPermission(requiredPermissions, availablePermissions);
    expect(result).toBe(false);
  });
});
