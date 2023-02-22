import groupApi from '~/api/GroupApi';
import appConfig from '~/configs/appConfig';
import { IGroupGetMembers } from '~/interfaces/IGroup';
import showToastError from '~/store/helper/showToastError';
import { IGroupMemberState } from '..';

const getGroupSearchMembers
  = (set, get) => async (payload: IGroupGetMembers) => {
    try {
      const { groupId, params, silentRefresh = false } = payload;
      const { search }: IGroupMemberState = get();
      const { canLoadMore, data, loading } = search;

      if (
        !silentRefresh
        && (!canLoadMore || loading || params.key?.trim().length === 0)
      ) { return; }

      set((state: IGroupMemberState) => {
        state.search.loading = !silentRefresh;
        state.search.key = params.key;
      }, 'getGroupSearchMembers fetching');

      const resp = await groupApi.getGroupMembers(groupId, {
        limit: silentRefresh ? data.length : appConfig.recordsPerPage,
        offset: silentRefresh ? 0 : data.length,
        ...params,
      });

      let newDataCount = 0;
      let newDataArr: any = [];
      const members = resp.data;
      Object.keys(members)?.forEach?.((role: string) => {
        newDataCount += members[role]?.data?.length || 0;
        newDataArr = [...newDataArr, ...(members[role]?.data || [])];
      });

      set((state: IGroupMemberState) => {
        state.search.loading = false;
        state.search.canLoadMore = newDataCount === appConfig.recordsPerPage;
        state.search.data = silentRefresh
          ? [...newDataArr]
          : [...data, ...newDataArr];
      }, 'getGroupSearchMembers success');
    } catch (e) {
      console.error('getGroupSearchMembers error:', e);
      showToastError(e);
      set((state: IGroupMemberState) => {
        state.search.loading = false;
      }, 'getGroupSearchMembers failed');
    }
  };

export default getGroupSearchMembers;
