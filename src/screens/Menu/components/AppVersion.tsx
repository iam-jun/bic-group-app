import { t } from 'i18next';
import React from 'react';
import { Button } from '~/baseComponents';
import Text from '~/baseComponents/Text';

import { APP_ENV } from '~/configs/appConfig';
import { useRootNavigation } from '~/hooks/navigation';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import useCodePushStore from '~/store/codePush';
import getEnv from '~/utils/env';

const AppVersion = () => {
  const { rootNavigation } = useRootNavigation();

  const isProduction = getEnv('APP_ENV') === APP_ENV.PRODUCTION;

  const updateDescription = useCodePushStore((state) => state?.currentUpdate?.description) || '';

  const onPressAppVersion = () => {
    rootNavigation.navigate(menuStack.componentCollection);
  };

  return (
    <Button disabled={isProduction} onPress={onPressAppVersion} testID="app_version">
      <Text.BodyS>
        {t('common:text_version')}
        {getEnv('APP_VERSION')}
        {!!updateDescription && updateDescription !== '(0)' && ` ${updateDescription}`}
      </Text.BodyS>
    </Button>
  );
};

export default AppVersion;
