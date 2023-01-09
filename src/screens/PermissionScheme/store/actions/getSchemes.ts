import groupApi from '~/api/GroupApi';
import showToastError from '~/store/helper/showToastError';
import IPermissionSchemeState from '../Interface';

const getSchemes = (set) => async (payload: {communityId: string; isRefreshing?: boolean}) => {
  try {
    const { communityId, isRefreshing } = payload || {};

    // avoid appearing Loading when updating group scheme successfully and navigating back
    if (!isRefreshing) {
      set((state: IPermissionSchemeState) => {
        state.schemes = {
          loading: true,
          data: undefined,
          allSchemes: undefined,
        };
      }, 'getSchemes');
    }

    const response = await groupApi.getSchemes(communityId);

    if (response?.data) {
      const { communityScheme, groupSchemes } = response.data || {};
      const allSchemes: any = {};
      if (communityScheme?.id) {
        allSchemes[communityScheme.id] = communityScheme;
      }
      groupSchemes?.forEach?.((scheme: any) => {
        allSchemes[scheme?.id] = scheme;
      });
      set((state: IPermissionSchemeState) => {
        state.schemes.loading = false;
        state.schemes.data = {
          generalScheme: communityScheme,
          groupSchemes,
        };
        state.schemes.allSchemes = allSchemes;
      }, 'getSchemesSuccess');
    } else {
      set((state: IPermissionSchemeState) => {
        state.schemes = {
          loading: false,
          data: undefined,
          allSchemes: undefined,
        };
      }, 'getSchemesFailure');
    }
  } catch (error) {
    console.error('getSchemes error:', error);

    set((state: IPermissionSchemeState) => {
      state.schemes = {
        loading: false,
        data: undefined,
        allSchemes: undefined,
      };
    }, 'getSchemesError');

    showToastError(error);
  }
};

export default getSchemes;
