import React, {FC, useState} from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Animated, {
  Layout,
  LightSpeedInLeft,
  ZoomIn,
} from 'react-native-reanimated';
import {useDispatch} from 'react-redux';
import groupsActions from '~/screens/Groups/redux/actions';
import Icon from '~/beinComponents/Icon';

export interface MoveGroupTargetsProps {
  style?: StyleProp<ViewStyle>;
  targets: any[];
  selecting?: any;
}

const MoveGroupTargets: FC<MoveGroupTargetsProps> = ({
  style,
  targets,
  selecting,
}: MoveGroupTargetsProps) => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const onPressItem = (item: any) => {
    dispatch(groupsActions.setGroupStructureMoveSelecting(item));
  };

  const renderItem = (item: any, index: number) => {
    const isActive = selecting?.id === item?.id;
    return (
      <Animated.View entering={LightSpeedInLeft} layout={Layout.springify()}>
        <TouchableOpacity
          style={[
            styles.itemContainer,
            isActive ? styles.itemContainerActive : {},
          ]}
          onPress={() => onPressItem(item)}>
          <Text
            style={styles.textName}
            variant={isActive ? 'bodySM' : 'bodyS'}
            numberOfLines={2}>
            {item?.name}
          </Text>
          <View style={{minWidth: 20, minHeight: 20}}>
            {isActive && (
              <Animated.View entering={ZoomIn}>
                <Icon icon={'Check'} tintColor={colors.primary6} />
              </Animated.View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text.H5
        style={{
          marginHorizontal: spacing.margin.extraLarge,
          marginBottom: spacing.margin.small,
        }}
        useI18n>
        communities:group_structure:text_move_to
      </Text.H5>
      <Animated.View>{targets?.map?.(renderItem)}</Animated.View>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.padding.extraLarge,
      paddingVertical: spacing.padding.large,
    },
    itemContainerActive: {
      backgroundColor: colors.bgSecondary,
    },
    textName: {
      flex: 1,
    },
  });
};

export default MoveGroupTargets;
