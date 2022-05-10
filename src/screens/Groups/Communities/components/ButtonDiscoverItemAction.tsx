import React, {FC} from 'react';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Button from '~/beinComponents/Button';
import {ICommunity} from '~/interfaces/ICommunity';
import icons from '~/resources/icons';
import groupJoinStatus from '~/constants/groupJoinStatus';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {useRootNavigation} from '~/hooks/navigation';

export interface ButtonDiscoverItemActionProps {
  community: ICommunity;
}

const ButtonDiscoverItemAction: FC<ButtonDiscoverItemActionProps> = ({
  community,
}: ButtonDiscoverItemActionProps) => {
  const {rootNavigation} = useRootNavigation();
  const theme = useTheme() as ITheme;
  const {colors} = theme;

  const {join_status} = community || {};

  console.log(
    `\x1b[34m🐣️ ButtonDiscoverItemAction ButtonDiscoverItemAction`,
    `${JSON.stringify(community, undefined, 2)}\x1b[0m`,
  );

  let icon, text;

  switch (join_status) {
    case groupJoinStatus.unableToJoin:
      break;
    case groupJoinStatus.requested:
      text = 'common:btn_cancel';
      break;
    case groupJoinStatus.visitor:
      icon = icons.Plus;
      text = 'common:btn_join';
      break;
    case groupJoinStatus.member:
      text = 'common:btn_view';
      break;
  }

  const onPressView = () => {
    if (community?.id !== undefined) {
      rootNavigation.navigate(groupStack.communityDetail, {
        communityId: community.id,
      });
    }
  };

  const onPressJoin = () => {
    alert('Request join ' + community?.name);
  };

  const onPressCancel = () => {
    alert('Cancel join ' + community?.name);
  };

  const onPress = () => {
    switch (join_status) {
      case groupJoinStatus.requested:
        onPressCancel();
        break;
      case groupJoinStatus.visitor:
        onPressJoin();
        break;
      case groupJoinStatus.member:
        onPressView();
        break;
    }
  };

  if (!text) {
    return null;
  }

  return (
    <Button.Secondary
      textVariant={'h5'}
      textColor={colors.textPrimary}
      leftIcon={icon}
      useI18n
      color={colors.bgHover}
      onPress={onPress}>
      {text}
    </Button.Secondary>
  );
};

export default ButtonDiscoverItemAction;
