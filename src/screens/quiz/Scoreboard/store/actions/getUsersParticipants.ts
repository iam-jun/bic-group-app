import streamApi from '~/api/StreamApi';
import { IScoreboardState } from '../index';
import showToastError from '~/store/helper/showToastError';
import { IParamsGetUsersParticipants, IPayloadGetUsersParticipants } from '~/interfaces/IQuiz';

const getUsersParticipants = (set, get) => async (payload: IPayloadGetUsersParticipants) => {
  const { contentId, isRefresh = true } = payload;
  const { userParticipants }: IScoreboardState = get();
  const {
    data: listUserParticipants,
    loading,
    endCursor,
  } = userParticipants || {};
  const endCursorParams = isRefresh ? null : endCursor;

  if (loading || !contentId) return;
  
  try {
    set((state: IScoreboardState) => {
      if(isRefresh) {
        state.userParticipants.refreshing = true;
      } else {
        state.userParticipants.loading = true;
      }
    }, 'getUsersParticipants');

    const params = {
      endCursor: endCursorParams,
    } as IParamsGetUsersParticipants;
    const response = await streamApi.getUsersParticipants(contentId, params);

    const result = response?.data?.list || [];
    const newData = isRefresh ? result || [] : listUserParticipants.concat(result || []);

    set((state: IScoreboardState) => {
      state.userParticipants.data = newData;
      state.userParticipants.hasNextPage = response?.data?.meta?.hasNextPage;
      state.userParticipants.endCursor = response?.data?.meta?.endCursor;
      state.userParticipants.refreshing = false;
      state.userParticipants.loading = false;
    }, 'getUsersParticipantSuccess');
  } catch (error) {
    set((state: IScoreboardState) => {
      state.userParticipants.refreshing = false;
      state.userParticipants.endCursor = null;
      state.userParticipants.loading = false;
      state.userParticipants.hasNextPage = false;
    }, 'getUsersParticipantFailed');
    console.error('\x1b[31m🐣️ action getUsersParticipants error: ', error, '\x1b[0m');
    showToastError(error);
  }
}

export default getUsersParticipants;
