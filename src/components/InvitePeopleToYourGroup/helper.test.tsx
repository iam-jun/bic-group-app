import { ITypeGroup } from '~/interfaces/common';
import {
  onCancel, onCloseModalInvitePeopleToYourGroup, onConfirm, onPressButtonInvite,
} from './helper';
import useGroupJoinableUsersStore from './store';

describe('helper InvitePeopleToYourGroup', () => {
  const params = {
    groupId: 'test',
    type: ITypeGroup.COMMUNITY,
  };
  it('onPressButtonInvite return correct', async () => {
    const response = onPressButtonInvite(params);
    expect(response).toBe(true);
  });
  it('onCloseModalInvitePeopleToYourGroup return correct', async () => {
    useGroupJoinableUsersStore.setState((state) => {
      state.selectedUsers = ['test'];
      return state;
    });
    const response = onCloseModalInvitePeopleToYourGroup(params);
    expect(response).toBe(true);
  });
  it('onCancel return correct', async () => {
    const response = onCancel(params);
    expect(response).toBe(true);
  });
  it('onConfirm return correct', async () => {
    const response = onConfirm();
    expect(response).toBe(true);
  });
});
