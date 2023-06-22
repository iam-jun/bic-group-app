import { ICommunityBadges } from '~/interfaces/IEditUser';
import { IUserBadgesState } from '../index';
import { searchText } from '~/utils/common';

const searchBadgesByName = (badgesByCommunity: ICommunityBadges[], searchQuery: string) => {
  const query = searchQuery.toLowerCase();
  const result = [];
  badgesByCommunity.forEach((comBadges) => {
    const { badges } = comBadges;
    if (badges.length > 0) {
      const filterBadges = badges.filter((badge) => {
        const badgeName = badge.name.toLowerCase();
        return searchText(query, badgeName);
      });
      if (filterBadges.length > 0) {
        result.push({ ...comBadges, badges: filterBadges });
      }
    }
  });
  return result;
};

const searchBadges = (set, get) => async (textSearch: string) => {
  try {
    const query = textSearch.trim();
    const { ownBadges = [] }:IUserBadgesState = get();
    set((state: IUserBadgesState) => {
      state.loadingSearch = true;
    }, 'searchBadgesLoading');

    const badges = searchBadgesByName(ownBadges, query);

    set((state: IUserBadgesState) => {
      state.dataSearch = query ? badges : ownBadges;
      state.loadingSearch = false;
    }, 'searchBadgesSuccess');
  } catch (error) {
    console.error('searchBadges error:', error);
    set((state: IUserBadgesState) => {
      state.loadingSearch = false;
    }, 'searchBadgesError');
  }
};

export default searchBadges;
