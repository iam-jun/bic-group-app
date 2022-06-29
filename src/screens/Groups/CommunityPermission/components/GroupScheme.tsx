import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle, FlatList} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import modalActions from '~/store/modal/actions';
import {useDispatch} from 'react-redux';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '../../redux/keySelector';
import SchemeItem from './SchemeItem';
import {IGroupScheme} from '~/interfaces/IGroup';
import Divider from '~/beinComponents/Divider';
import ViewSpacing from '~/beinComponents/ViewSpacing';

export interface GroupSchemeProps {
  style?: StyleProp<ViewStyle>;
}

const GroupScheme: FC<GroupSchemeProps> = ({style}: GroupSchemeProps) => {
  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const {data} = useKeySelector(groupsKeySelector.permission.schemes) || {};
  const {groupSchemes} = data || {};

  const onPressAssign = () => {
    dispatch(modalActions.showAlertNewFeature());
  };

  const renderItem = ({item}: {item: IGroupScheme}) => {
    return <SchemeItem item={item} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={[styles.flex1, styles.row]}>
          <Text.H5 useI18n>communities:permission:title_group_scheme</Text.H5>
          {groupSchemes?.length > 0 && (
            <Text.H5>{` (${groupSchemes.length})`}</Text.H5>
          )}
        </View>
        {groupSchemes?.length > 0 && (
          <View style={styles.buttonContainer}>
            <Button.Primary
              onPress={onPressAssign}
              useI18n
              style={styles.buttonAssign}>
              communities:permission:btn_assign
            </Button.Primary>
          </View>
        )}
      </View>

      <View style={styles.descScheme}>
        <Text.Subtitle useI18n>
          communities:permission:text_desc_group_scheme
        </Text.Subtitle>
      </View>

      {groupSchemes?.length > 0 && (
        <FlatList
          data={groupSchemes}
          renderItem={renderItem}
          style={styles.groupSchemeList}
          scrollEnabled={false}
          ItemSeparatorComponent={() => (
            <>
              <Divider />
              <ViewSpacing height={8} />
            </>
          )}
        />
      )}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    flex1: {flex: 1},
    container: {
      padding: spacing.padding.large,
      backgroundColor: colors.background,
      marginTop: spacing.margin.base,
      borderRadius: spacing.borderRadius.small,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.margin.small,
    },
    buttonAssign: {
      paddingRight: spacing.padding.base,
      paddingVertical: spacing.padding.tiny,
    },
    buttonContainer: {
      minHeight: 30,
      justifyContent: 'center',
      flexDirection: 'row',
    },
    groupSchemeList: {
      marginTop: spacing.margin.large,
    },
    descScheme: {
      marginTop: spacing.margin.tiny,
    },
  });
};

export default GroupScheme;
