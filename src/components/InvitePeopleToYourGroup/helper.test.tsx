import {
  onCancel, onCloseModalInvitePeopleToYourGroup, onConfirm, onPressButtonInvite,
} from './helper';
import useGroupJoinableUsersStore from './store';

describe('helper InvitePeopleToYourGroup', () => {
  it('onPressButtonInvite return correct', async () => {
    const response = onPressButtonInvite('test');
    expect(response).toBe(true);
  });
  it('onCloseModalInvitePeopleToYourGroup return correct', async () => {
    useGroupJoinableUsersStore.setState((state) => {
      state.selectedUsers = ['test'];
      return state;
    });
    const response = onCloseModalInvitePeopleToYourGroup('test');
    expect(response).toBe(true);
  });
  it('onCancel return correct', async () => {
    const response = onCancel('test');
    expect(response).toBe(true);
  });
  it('onConfirm return correct', async () => {
    const response = onConfirm();
    expect(response).toBe(true);
  });
});
