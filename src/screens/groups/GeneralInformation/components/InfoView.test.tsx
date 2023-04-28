import React from 'react';
import { GroupPrivacyType } from '~/constants/privacyTypes';
import * as navigationHook from '~/hooks/navigation';
import { render } from '~/test/testUtils';
import InfoView from './InfoView';

describe('InfoView component', () => {
  const baseProps = {
    id: 'id-123',
    name: 'This is group name',
    description: 'This is group description',
    rootGroupId: '12',
    type: 'community',
  };

  const navigate = jest.fn();
  const goBack = jest.fn();
  const rootNavigation = { navigate, goBack };
  jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

  it('renders name and description correctly', () => {
    const props = {
      ...baseProps,
      privacy: GroupPrivacyType.PRIVATE,
      canEditPrivacy: false,
      canEditInfo: false,
      isJoinApproval: true,
    };

    const { getByTestId } = render(
      <InfoView {...props} type="community" />,
    );
    expect(getByTestId('info_view.name').props.children).toEqual(baseProps.name);
    expect(getByTestId('info_view.description').props.children).toEqual(baseProps.description);
  });

  it('should show 2 edit icons for name and description correctly when canEditInfo=true and canEditPrivacy=false', () => {
    const props = {
      ...baseProps,
      privacy: GroupPrivacyType.PRIVATE,
      canEditPrivacy: false,
      canEditInfo: true,
      isJoinApproval: true,
    };

    const { queryAllByTestId } = render(
      <InfoView {...props} type="community" />,
    );
    const editButtons = queryAllByTestId('info_card.button_edit');
    expect(editButtons.length).toEqual(2);
  });

  it('should NOT show 2 edit icons for name and description correctly when canEditInfo=false and canEditPrivacy=false', () => {
    const props = {
      ...baseProps,
      privacy: GroupPrivacyType.PRIVATE,
      canEditPrivacy: false,
      canEditInfo: false,
      isJoinApproval: true,
    };

    const { queryAllByTestId } = render(
      <InfoView {...props} type="community" />,
    );
    const editButtons = queryAllByTestId('info_card.button_edit');
    expect(editButtons.length).toEqual(0);
  });

  it('should render privacy type PRIVATE and description correctly', () => {
    const props = {
      ...baseProps,
      privacy: GroupPrivacyType.PRIVATE,
      canEditPrivacy: false,
      canEditInfo: false,
      isJoinApproval: true,
    };

    const { getByTestId, queryByTestId } = render(
      <InfoView {...props} type="community" />,
    );
    const privacyType = getByTestId('info_view.privacy_type');
    expect(privacyType.props.children).toEqual('Private');
    const privacyDescription = getByTestId('info_view.privacy_description');
    expect(privacyDescription.props.children).toEqual('The community is visible and accessible to non-members who haven’t joined. However, all content & activities inside are not visible and accessible to non-members.');
    const privateBannerView = queryByTestId('info_view.private_banner_view');
    expect(privateBannerView).not.toBeNull();
    const secretBannerView = queryByTestId('info_view.secret_banner_view');
    expect(secretBannerView).toBeNull();
  });

  it('should render privacy type OPEN and description correctly', () => {
    const props = {
      ...baseProps,
      privacy: GroupPrivacyType.OPEN,
      canEditPrivacy: false,
      canEditInfo: false,
      isJoinApproval: true,
    };

    const { getByTestId, queryByTestId } = render(
      <InfoView {...props} type="community" />,
    );
    const privacyType = getByTestId('info_view.privacy_type');
    expect(privacyType.props.children).toEqual('Open');
    const privacyDescription = getByTestId('info_view.privacy_description');
    expect(privacyDescription.props.children).toEqual('The community is visible and accessible to non-members who haven’t joined. All content & activities inside are visible to non-members also.');
    const privateBannerView = queryByTestId('info_view.private_banner_view');
    expect(privateBannerView).toBeNull();
    const secretBannerView = queryByTestId('info_view.secret_banner_view');
    expect(secretBannerView).toBeNull();
  });

  it('should render privacy type SECRET and description correctly', () => {
    const props = {
      ...baseProps,
      privacy: GroupPrivacyType.SECRET,
      canEditPrivacy: false,
      canEditInfo: false,
      isJoinApproval: true,
    };

    const { getByTestId, queryByTestId } = render(
      <InfoView {...props} type="community" />,
    );
    const privacyType = getByTestId('info_view.privacy_type');
    expect(privacyType.props.children).toEqual('Secret');
    const privacyDescription = getByTestId('info_view.privacy_description');
    expect(privacyDescription.props.children).toEqual('All registered users cannot discover and search to find this community. The content & activities inside are not visible to all users.');
    const privateBannerView = queryByTestId('info_view.private_banner_view');
    expect(privateBannerView).toBeNull();
    const secretBannerView = queryByTestId('info_view.secret_banner_view');
    expect(secretBannerView).not.toBeNull();
  });
});
