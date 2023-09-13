import { renderTabs } from './helper';

describe('helper CommunityMembers', () => {
  it('renderTabs return correct', async () => {
    const onPressTab = jest.fn();
    const response = renderTabs({
      isShowMemberRequestsTab: true,
      isShowInvitedPeopleTab: true,
      selectedIndex: 2,
      onPressTab,
    });
    expect(response).toBeTruthy();
  });
});
