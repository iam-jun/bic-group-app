import {cleanup} from '@testing-library/react-native';
import {SAMPLE_ACTIVITIES} from './constants';
import {
  getCombinedInfo,
  getNotificationContent,
  processNotiBody,
  sliceText,
} from './helper';

afterEach(cleanup);

describe('NotificationItem helper', () => {
  it(`getCombinedInfo should work`, async () => {
    expect(getCombinedInfo(SAMPLE_ACTIVITIES[0] as any)).toStrictEqual({
      actorNames: 'Trần Nam Anh',
      verbText: '',
    });
  });

  it(`getCombinedInfo should count actors`, async () => {
    //@ts-ignore
    expect(getCombinedInfo(SAMPLE_ACTIVITIES[1] as any)).toStrictEqual({
      actorNames: 'notification:number_people',
      verbText: '',
    });
  });

  it(`sliceText should work`, async () => {
    expect(sliceText('1234 5678 \n9', 10)).toBe('1234 5678 ');
  });

  it(`sliceText should have 3 dots`, async () => {
    expect(sliceText('1234 5678 \n9', 3)).toBe('123...');
  });

  it(`processNotiBody should work`, async () => {
    expect(processNotiBody('   1234 5678 \n9   ')).toBe('1234 5678 ');
  });

  it(`getNotificationContent should work`, async () => {
    expect(getNotificationContent(SAMPLE_ACTIVITIES[0] as any)).toStrictEqual({
      title: {
        actorNames: 'Trần Nam Anh',
        verbText:
          'notification:commented_on_your_post notification:number_times',
      },
      body: null,
    });
  });
});
