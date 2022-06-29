import React, {FC} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Header from '~/beinComponents/Header';
import {useBaseHook} from '~/hooks';
import {useKeySelector} from '~/hooks/selector';
import groupsKeySelector from '~/screens/Groups/redux/keySelector';
import {isEqual} from 'lodash';
import {dispatch} from 'jest-circus/build/state';
import groupsActions from '~/screens/Groups/redux/actions';
import {useDispatch} from 'react-redux';

export interface ReorderGroupHeaderProps {
  style?: StyleProp<ViewStyle>;
  initOrder?: any;
}

const ReorderGroupHeader: FC<ReorderGroupHeaderProps> = ({
  style,
  initOrder,
}: ReorderGroupHeaderProps) => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors, spacing} = theme;
  const styles = createStyle(theme);

  const {id: communityId} = useKeySelector(groupsKeySelector.communityDetail);
  const {loading, newOrder} = useKeySelector(
    groupsKeySelector.groupStructure.reorder,
  );

  const hasChanged = !!newOrder && !isEqual(newOrder, initOrder);
  const disabled = loading || !hasChanged;

  const onPressSave = () => {
    if (communityId && newOrder) {
      dispatch(groupsActions.putGroupStructureReorder({communityId, newOrder}));
    }
  };

  return (
    <Header
      title={t('communities:group_structure:title_reorder_group')}
      onPressButton={onPressSave}
      buttonText={'common:btn_save'}
      buttonProps={{
        loading: loading,
        disabled: disabled,
        useI18n: true,
        highEmphasis: true,
        style: {borderWidth: 0},
        testID: 'reorder_group.btn_save',
      }}
    />
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {},
  });
};

export default ReorderGroupHeader;
