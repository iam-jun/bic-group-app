import { t } from 'i18next';
import { checkTypeByRootGroup } from './helper';
import { ICommunity } from '~/interfaces/ICommunity';
import { IGroup } from '~/interfaces/IGroup';

describe('helper MembershipPolicySettings', () => {
  it('should replace item success', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const data: ICommunity | IGroup = { level: 0 };

    const fn = checkTypeByRootGroup(data);
    expect(fn).toEqual(t('settings:membership_policy_settings:community1'));
  });
});
