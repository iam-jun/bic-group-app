import React from 'react';
import { render } from '~/test/testUtils';
import CommunityMemberRequests from './index';
import { ICommunity } from '~/interfaces/ICommunity';
import useCommunityMemberStore from '../store';

describe('CommunityMemberRequests', () => {
  const community = {
    id: 'community-id',
    groupId: 'group-id',
  } as ICommunity;
  const onPressAdd = jest.fn();

  it('should render correctly when canApproveRejectJoiningRequests = true & canEditJoinSetting = true', () => {
    const { getByTestId } = render(
      <CommunityMemberRequests
        community={community}
        canAddMember
        canApproveRejectJoiningRequests
        canEditJoinSetting
        onPressAdd={onPressAdd}
      />,
    );

    const memberList = getByTestId('member_request_list');
    const joinSetting = getByTestId('join_request_setting');
    expect(memberList).toBeDefined();
    expect(joinSetting).toBeDefined();
  });

  it('should render correctly when canApproveRejectJoiningRequests = false & canEditJoinSetting = false', () => {
    const { queryByTestId } = render(
      <CommunityMemberRequests
        community={community}
        canAddMember
        canApproveRejectJoiningRequests={false}
        canEditJoinSetting={false}
        onPressAdd={onPressAdd}
      />,
    );
    const memberList = queryByTestId('member_request_list');
    const joinSetting = queryByTestId('join_request_setting');
    expect(memberList).toBeNull();
    expect(joinSetting).toBeNull();
  });

  it('should render correctly when canApproveRejectJoiningRequests = true and ids length > 1', () => {
    useCommunityMemberStore.setState((state) => {
      state.communityMemberRequests.ids = ['2d1ed7aa-501b-48ff-99e4-2b94f1a2a574', '2d1ed7aa-501b-48ff-99e4-2b94f1a2a574'];
      state.communityMemberRequests.items = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        '2d1ed7aa-501b-48ff-99e4-2b94f1a2a574': {
          id: '2d1ed7aa-501b-48ff-99e4-2b94f1a2a574',
          user: {
            id: '838391fc-448c-4336-b960-8d6d81afb212',
            city: null,
            email: 'dieplamminhthu@tgm.vn',
            phone: null,
            avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/ef3948ab-24c8-4ebd-ac4c-0e9fb572797e.jpg',
            country: 'Việt Nam',
            username: 'dlminhthu',
            fullname: 'Diệp Lâm Minh Thư',
            countryCode: '+84',
            latestWork: null,
          },
        },
      };
      return state;
    });

    const { queryByTestId } = render(
      <CommunityMemberRequests
        community={community}
        canAddMember
        canApproveRejectJoiningRequests
        canEditJoinSetting
        onPressAdd={onPressAdd}
      />,
    );

    const buttonView = queryByTestId('button_approve_decline_all_requests');
    expect(buttonView).not.toBeNull();
  });

  it('should render correctly when canApproveRejectJoiningRequests = true and ids length = 1', () => {
    useCommunityMemberStore.setState((state) => {
      state.communityMemberRequests.ids = ['2d1ed7aa-501b-48ff-99e4-2b94f1a2a574'];
      state.communityMemberRequests.items = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        '2d1ed7aa-501b-48ff-99e4-2b94f1a2a574': {
          id: '2d1ed7aa-501b-48ff-99e4-2b94f1a2a574',
          user: {
            id: '838391fc-448c-4336-b960-8d6d81afb212',
            city: null,
            email: 'dieplamminhthu@tgm.vn',
            phone: null,
            avatar: 'https://bic-dev-entity-attribute-s3-bucket.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/ef3948ab-24c8-4ebd-ac4c-0e9fb572797e.jpg',
            country: 'Việt Nam',
            username: 'dlminhthu',
            fullname: 'Diệp Lâm Minh Thư',
            countryCode: '+84',
            latestWork: null,
          },
        },
      };
      return state;
    });

    const { queryByTestId } = render(
      <CommunityMemberRequests
        community={community}
        canAddMember
        canApproveRejectJoiningRequests
        canEditJoinSetting
        onPressAdd={onPressAdd}
      />,
    );

    const buttonView = queryByTestId('button_approve_decline_all_requests');
    expect(buttonView).toBeNull();
  });
});
