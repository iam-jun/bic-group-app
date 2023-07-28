import { t } from 'i18next';
import { isGroup } from '~/helpers/groups';
import { ICommunity } from '~/interfaces/ICommunity';
import { IGroup } from '~/interfaces/IGroup';

export const checkTypeByRootGroup = (data: ICommunity | IGroup) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!isGroup(data)) {
    return t('settings:membership_policy_settings:community');
  }
  return t('settings:membership_policy_settings:group');
};
