import React, {FC} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
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
import SearchInput from '~/beinComponents/inputs/SearchInput';
import {debounce} from 'lodash';
import {useBaseHook} from '~/hooks';

export interface MoveGroupTargetsProps {
  communityId: number;
  groupId: number;
  targets: any[];
  selecting?: any;
}

const MoveGroupTargets: FC<MoveGroupTargetsProps> = ({
  communityId,
  groupId,
  targets,
  selecting,
}: MoveGroupTargetsProps) => {
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const onPressItem = (item: any) => {
    dispatch(groupsActions.setGroupStructureMoveSelecting(item));
  };

  const onChangeSearch = debounce((key: string) => {
    dispatch(
      groupsActions.getGroupStructureMoveTargets({communityId, groupId, key}),
    );
  }, 300);

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
      <SearchInput
        style={styles.searchInput}
        onChangeText={onChangeSearch}
        placeholder={t(
          'communities:group_structure:text_move_group_search_placeholder',
        )}
      />
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
    searchInput: {
      marginBottom: spacing.margin.base,
      marginHorizontal: spacing.margin.base,
      backgroundColor: colors.background,
      borderColor: colors.primary6,
      borderWidth: 1,
    },
  });
};

export default MoveGroupTargets;
