import showToastError from '~/store/helper/showToastError';
import { IMyInvitationsStore } from '../index';
import groupApi from '~/api/GroupApi';

const getInvitations = (set, get) => async (isRefresh?: boolean) => {
  try {
    const { invitationIds, hasNextPage }: IMyInvitationsStore = get();
    if (!hasNextPage || !isRefresh) return;

    set((state: IMyInvitationsStore) => {
      state.loading = true;
    }, 'getInvitations');

    const payload = {
      offset: isRefresh ? 0 : invitationIds.length,
    };

    const response = await groupApi.getMyInvitations(payload);
    const { data, meta } = response;

    const newIds = data.map((item) => item.id) || [];
    const newInvitaionIds = isRefresh ? newIds : [...invitationIds, ...newIds];
    const newItems = data.reduce(
      (accumulator, currentItem) => ({
        ...accumulator,
        [currentItem.id]: currentItem,
      }),
      {},
    );
    console.log('newItems', newItems);

    set((state: IMyInvitationsStore) => {
      state.loading = false;
      state.invitationIds = newInvitaionIds;
      state.invitationData = { ...state.invitationData, ...newItems };
      state.hasNextPage = meta.hasNextPage;
    }, 'getInvitationsSuccess');
    // showToastSuccess(response);
  } catch (err) {
    set((state: IMyInvitationsStore) => {
      state.loading = false;
    }, 'getInvitationsError');
    console.error(
      '\x1b[33m', 'get my Invitations error', err, '\x1b[0m',
    );
    showToastError(err);
  }
};

export default getInvitations;
