import React from 'react';
import {StyleSheet} from 'react-native';
import Text from '../../texts/Text';
import HorizontalView from '../../layout/HorizontalView';
import Icon from '../../Icon';
import {IconType} from '~/resources/icons';
import {useBaseHook} from '~/hooks';
import {
  primary as ACTIVE_COLOR,
  grey6 as INACTIVE_COLOR,
} from '~/theme/colors';

export interface IReactionAction {
  icon: IconType;
  label?: string;
  isLike?: boolean;
  inactiveColor?: string;
  activeColor?: string;
  type: string;
}

const ReactionActionItem: React.FC<IReactionAction> = ({
  icon,
  label,
  isLike,
  inactiveColor = INACTIVE_COLOR,
  activeColor = ACTIVE_COLOR,
  type,
}) => {
  const {t} = useBaseHook();
  const tintColor = isLike ? activeColor : inactiveColor;
  if (type === 'like') {
    icon = isLike ? 'iconLike' : 'iconLikeOutline';
  }

  return (
    <HorizontalView style={styles.container}>
      <Icon
        icon={icon}
        tintColor={tintColor}
        size={18}
        bold={isLike}
        style={styles.icon}
      />
      <Text
        maxBold={isLike ? true : false}
        primary={isLike ? styles.activeButton : styles.inactiveButton}>
        {t(`post:${label}`)}
      </Text>
    </HorizontalView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginEnd: 4,
  },
  activeButton: {
    color: ACTIVE_COLOR,
  },
  inactiveButton: {
    color: INACTIVE_COLOR,
  },
});

export default ReactionActionItem;
