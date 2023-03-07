import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import matchDeepLinkTestCases from '~/test/mock_data/matchDeepLink';
import {
  formatChannelLink,
  formatDMLink,
  generateLink, getChatDomain,
  getErrorMessageFromResponse,
  getGroupLink, getHostNameFromUri,
  LinkGeneratorTypes, matchDeepLink,
  openInAppBrowser, openUrl,
} from '.';

describe('Link utils', () => {
  it('should run generateLink correctly', () => {
    const testData = [
      { type: LinkGeneratorTypes.POST, value: 'posts' },
      { type: LinkGeneratorTypes.COMMENT, value: 'posts' },
      { type: LinkGeneratorTypes.COMMUNITY, value: 'communities' },
      { type: LinkGeneratorTypes.SERIRES, value: 'series' },
      { type: LinkGeneratorTypes.ARTICLE, value: 'article' },
    ];

    testData.forEach((testCase) => {
      const test1 = generateLink(testCase.type);
      expect(test1).toEqual(`https://www.beincom.io/${testCase.value}/`);

      const test2 = generateLink(testCase.type, '123');
      expect(test2).toEqual(`https://www.beincom.io/${testCase.value}/123`);

      const test3 = generateLink(testCase.type, '123', '456');
      expect(test3).toEqual(`https://www.beincom.io/${testCase.value}/123`);

      const test4 = generateLink(testCase.type, '123', { a: 1 });
      expect(test4).toEqual(`https://www.beincom.io/${testCase.value}/123?a=1`);
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const test5 = generateLink('test', '123', { a: 1 });
    expect(test5).toEqual('');
  });

  it('should run generateLink COMMENT in snake case params', () => {
    const test1 = generateLink(LinkGeneratorTypes.COMMENT, '123', { commentId: 1 });
    expect(test1).toEqual('https://www.beincom.io/posts/123?comment_id=1');
  });

  it('should run getGroupLink correctly', () => {
    const test1 = getGroupLink({ communityId: '123', groupId: '456' });
    expect(test1).toEqual('https://www.beincom.io/communities/123/groups/456');

    const test2 = getGroupLink({ communityId: '123', groupId: '456', params: { commentId: 1 } });
    expect(test2).toEqual('https://www.beincom.io/communities/123/groups/456?commentId=1');
  });

  it('should run getChatDomain correctly', () => {
    const test1 = getChatDomain();
    expect(test1).toEqual('https://chat.beincom.io');
  });

  it('should run formatChannelLink correctly', () => {
    const test1 = formatChannelLink('123', 'teamname');
    expect(test1).toEqual('bicchat://chat.beincom.io/123/channels/teamname');
  });

  it('should run formatDMLink correctly', () => {
    const test1 = formatDMLink('123', 'username');
    expect(test1).toEqual('bicchat://chat.beincom.io/123/messages/@username');
  });

  it('should run getHostNameFromUri correctly', () => {
    const test1 = getHostNameFromUri('https://chat.beincom.io/');
    expect(test1).toBe('beincom.io');

    const test2 = getHostNameFromUri('https://chat.beincom.io/', true);
    expect(test2).toBe('chat.beincom.io');

    const test3 = getHostNameFromUri('bicchat://chat.beincom.io/', true);
    expect(test3).toBe('chat.beincom.io');

    const test4 = getHostNameFromUri('bic://beincom.io/', true);
    expect(test4).toBe('beincom.io');
  });

  it('should run openUrl in browser', async () => {
    const openURL = jest.fn();
    jest.spyOn(Linking, 'openURL').mockImplementation(openURL);

    await openUrl('https://chat.beincom.io');
    expect(openURL).toBeCalledWith('https://chat.beincom.io');
  });

  it('should run openUrl with BIC url in app', async () => {
    const openURL = jest.fn();

    jest.spyOn(Linking, 'openURL').mockImplementation(openURL);
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);

    await openUrl('https://www.beincom.io');
    expect(openURL).toBeCalledWith('bic://');
  });

  it('should run openUrl with BIC url in browser', async () => {
    const openURL = jest.fn();

    jest.spyOn(Linking, 'openURL').mockImplementation(openURL);
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);

    await openUrl('https://www.beincom.io');
    expect(openURL).toBeCalledWith('https://www.beincom.io');
  });

  it('should run matchDeepLink correctly', () => {
    matchDeepLinkTestCases.forEach((testCase) => {
      const test = matchDeepLink(testCase.url);
      expect(test).toEqual(testCase.result);
    });
  });

  it('should run getErrorMessageFromResponse correctly', () => {
    const test1 = getErrorMessageFromResponse('response string');
    expect(test1).toEqual('response string');

    const test2 = getErrorMessageFromResponse({});
    expect(test2).toEqual(undefined);

    const test3 = getErrorMessageFromResponse({
      data: { meta: { errors: [{ message: 'error message in array' }] } },
    });
    expect(test3).toEqual('error message in array');

    const test4 = getErrorMessageFromResponse({
      data: { meta: { message: 'error message in meta' } },
    });
    expect(test4).toEqual('error message in meta');
  });

  it('should run openInAppBrowser in app', async () => {
    const open = jest.fn();

    jest.spyOn(InAppBrowser, 'open').mockImplementation(open);
    jest.spyOn(InAppBrowser, 'isAvailable').mockResolvedValue(true);

    await openInAppBrowser('https://www.beincom.io');
    expect(open).toBeCalledWith('https://www.beincom.io');
  });

  it('should run openInAppBrowser in browser', async () => {
    const open = jest.fn();

    jest.spyOn(InAppBrowser, 'open').mockImplementation(open);
    jest.spyOn(InAppBrowser, 'isAvailable').mockResolvedValue(false);

    await openInAppBrowser('https://www.beincom.io');
    expect(open).not.toBeCalled();
  });
});
