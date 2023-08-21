import { IGroupDetail } from '~/interfaces/IGroup';

const addToGroups = (set, get) => (payload: IGroupDetail) => {
  const { id } = payload?.group || {};
  const { groups } = get();
  const newGroups = { ...groups };

  newGroups[id] = payload;

  set({ groups: newGroups }, 'addToGroups');
};

export default addToGroups;
