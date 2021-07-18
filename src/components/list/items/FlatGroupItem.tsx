import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {IGroup} from '~/interfaces/IGroup';
import {useDispatch} from 'react-redux';
import {useTheme} from 'react-native-paper';
import {useBaseHook} from '~/hooks';
import {IObject} from '~/interfaces/common';
import {Text} from '~/components';
import Icon from '~/beinComponents/Icon';
import {grey9} from '~/theme/colors';
import GroupItem from '~/components/GroupItem';
import GroupTree from '~/components/GroupTree';

interface FlatGroupItem extends IGroup {}

const FlatGroupItem: React.FC<FlatGroupItem> = props => {
  const {id, name, userCount, parentId, parent, children, type, icon} = props;

  const [showTree, setShowTree] = useState(false);

  const dispatch = useDispatch();
  const theme = useTheme();
  const {spacing}: IObject<any> = theme;
  const {t, navigation} = useBaseHook();
  const styles = themeStyles(theme);

  const _onPressPath = () => {
    setShowTree(!showTree);
  };

  const getGroupParent = (group: IGroup, parents: IGroup[]) => {
    parents.push(group);
    if (group.parent) {
      getGroupParent(group.parent, parents);
    }
  };

  const renderPath = () => {
    const parents: IGroup[] = [];
    if (parent) {
      getGroupParent(parent, parents);
    }
    const largestParent: IGroup | undefined =
      parents?.length > 1 ? parents?.[parents?.length - 1] : undefined;
    const hasMiddleParent = parents?.length > 2;
    const directParent: IGroup | undefined = parents?.[0];
    return (
      <TouchableOpacity
        style={{marginHorizontal: spacing.margin.tiny}}
        onPress={_onPressPath}>
        <Text>
          {largestParent && <Text>{largestParent.name}/</Text>}
          {hasMiddleParent && <Text>.../</Text>}
          {directParent && <Text>{directParent.name}/</Text>}
          {parents?.length === 0 && <Text>/</Text>}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{marginTop: spacing.margin.tiny, flexDirection: 'row'}}>
        <View style={styles.iconNextContainer}>
          <Icon icon={'iconArrowRight'} size={12} tintColor={grey9} />
        </View>
        {renderPath()}
      </View>
      {showTree ? <GroupTree /> : <GroupItem {...props} />}
    </View>
  );
};

const themeStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {},
    iconNextContainer: {
      backgroundColor: colors.grey1,
      width: 16,
      height: 16,
      marginTop: 2,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default FlatGroupItem;
