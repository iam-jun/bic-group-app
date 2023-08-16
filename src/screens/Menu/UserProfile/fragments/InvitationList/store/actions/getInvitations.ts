import i18next from 'i18next';
import moment from 'moment';
import showToastError from '~/store/helper/showToastError';
import { IGroupedInvitations, IMyInvitationsStore } from '../index';
import groupApi from '~/api/GroupApi';
import { IInvitation, IInvitationsStatus } from '~/interfaces/IInvitation';

const formatDate = (inputDate:string) => {
  const currentDate = moment();
  const inputMoment = moment(inputDate);

  if (inputMoment.isSame(currentDate, 'day')) {
    return `${i18next.t('common:time:today')}, ${inputMoment.format('MMM DD, YYYY')}`;
  } if (inputMoment.isSame(currentDate.clone().subtract(1, 'day'), 'day')) {
    return `${i18next.t('common:time:yesterday')}, ${inputMoment.format('MMM DD, YYYY')}`;
  }
  return inputMoment.format('MMM DD, YYYY');
};

const groupInvitationsByCreatedAt = (
  inputData: IInvitation[],
  currentData: IGroupedInvitations[],
) => {
  const groupedData: IGroupedInvitations[] = currentData || [];

  inputData.forEach((item: IInvitation) => {
    if (item.status === IInvitationsStatus.WAITING) {
      const dateString = formatDate(item.createdAt);
      const indexOfGroup = groupedData.findIndex((group: IGroupedInvitations) => group?.title === dateString);

      if (indexOfGroup === -1) {
        const newData: string[] = [item.id];
        const newGroup = {
          id: groupedData.length + 1,
          title: dateString,
          data: newData,
        };
        groupedData.push(newGroup);
      } else {
        const newGroup = { ...groupedData[indexOfGroup], data: [...groupedData[indexOfGroup].data, item.id] };
        groupedData.splice(indexOfGroup, 1, newGroup);
      }
    }
  });

  return groupedData;
};

const getInvitations = (set, get) => async (isRefresh?: boolean) => {
  try {
    const { groupedInvitations, currentInvitationIds, hasNextPage }: IMyInvitationsStore = get();
    if (!hasNextPage && !isRefresh) return;

    set((state: IMyInvitationsStore) => {
      state.loading = true;
    }, 'getInvitations');

    const payload = {
      offset: isRefresh ? 0 : currentInvitationIds,
    };

    const response = await groupApi.getMyInvitations(payload);
    const { data, meta } = response;
    const newGroupedInvitations = groupInvitationsByCreatedAt(data, isRefresh ? [] : groupedInvitations);
    const newCurrentInvitationIds = isRefresh ? (data.length || 0) : (currentInvitationIds + (data.length || 0));

    const newItems = data.reduce(
      (accumulator, currentItem) => ({
        ...accumulator,
        [currentItem.id]: currentItem,
      }),
      {},
    );

    set((state: IMyInvitationsStore) => {
      state.loading = false;
      state.groupedInvitations = newGroupedInvitations;
      state.currentInvitationIds = newCurrentInvitationIds;
      state.invitationData = { ...state.invitationData, ...newItems };
      state.hasNextPage = meta.hasNextPage;
    }, 'getInvitationsSuccess');
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
