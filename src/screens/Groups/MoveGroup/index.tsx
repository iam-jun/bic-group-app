import React, {FC, useEffect} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Header from '~/beinComponents/Header';
import {useBaseHook} from '~/hooks';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import {useDispatch} from 'react-redux';
import groupsActions from '~/screens/Groups/redux/actions';
import {IGroup} from '~/interfaces/IGroup';

export interface MoveGroupProps {
  route?: {
    params?: {
      group: IGroup;
    };
  };
}

const MoveGroup: FC<MoveGroupProps> = ({route}: MoveGroupProps) => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const initGroup = route?.params?.group;
  const {id: groupId} = initGroup || {};

  const {id: communityId} = useKeySelector(groupsKeySelector.communityDetail);
  const {loading, targetGroups, movingGroup} =
    useKeySelector(groupsKeySelector.groupStructure.move) || {};

  console.log(
    `\x1b[34m🐣️ index MoveGroup`,
    `${JSON.stringify(initGroup, undefined, 2)}\x1b[0m`,
  );
  const {user_count} = movingGroup || {};

  const getMoveTargets = (key = '') => {
    if (communityId && groupId) {
      dispatch(
        groupsActions.getGroupStructureMoveTargets({communityId, groupId, key}),
      );
    }
  };

  useEffect(() => {
    getMoveTargets();

    return () => {
      dispatch(groupsActions.setGroupStructureMove());
    };
  }, []);

  return (
    <View style={styles.container}>
      <Header title={t('communities:group_structure:title_move_group')} />
      <Text>New Component MoveGroup</Text>
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });
};

export default MoveGroup;
