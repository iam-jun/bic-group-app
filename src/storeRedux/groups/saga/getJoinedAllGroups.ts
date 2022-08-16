/* eslint-disable no-empty */
/* eslint-disable require-yield */
import groupsActions from '~/storeRedux/groups/actions';

export default function* getJoinedAllGroups({
  payload,
}: ReturnType<typeof groupsActions.getJoinedAllGroups>) {
  try {
  } catch (err) {
    console.error('\x1b[33m', 'getJoinedCommunities : error', err, '\x1b[0m');
  }
}
