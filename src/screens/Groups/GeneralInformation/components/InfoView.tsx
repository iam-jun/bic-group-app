import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import {ITheme} from '~/theme/interfaces';
import {useRootNavigation} from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {titleCase} from '~/utils/common';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Icon from '~/beinComponents/Icon';
import modalActions from '~/store/modal/actions';

interface Props {
  id: string;
  onPressPrivacy?: () => void;
  name: string;
  description: string;
  privacy: string;
  can_edit_privacy: boolean;
  can_edit_info: boolean;
  type: 'community' | 'group';
}

const InfoView = ({
  id,
  onPressPrivacy,
  name,
  description,
  privacy,
  can_edit_info,
  can_edit_privacy,
  type,
}: Props) => {
  // const {name, description, privacy} =
  //   useKeySelector(groupsKeySelector.groupDetail.group) || {};
  // const can_edit_privacy = useKeySelector(
  //   groupsKeySelector.groupDetail.can_edit_privacy,
  // );
  // const can_edit_info = useKeySelector(
  //   groupsKeySelector.groupDetail.can_edit_info,
  // );

  const theme = useTheme() as ITheme;
  const styles = themeStyles(theme);
  const dispatch = useDispatch();

  const {rootNavigation} = useRootNavigation();

  const editDescription = () => {
    rootNavigation.navigate(groupStack.editDescription, {
      id,
      description,
      type,
    });
  };

  const editName = () => {
    // TODO: Add feature
    dispatch(modalActions.showAlertNewFeature());
  };

  return (
    <View style={styles.container}>
      <PrimaryItem
        testID="info_view.name"
        title={`settings:title_${type}_name`}
        titleProps={{useI18n: true}}
        subTitle={name}
        onPress={can_edit_info ? editName : undefined}
        RightComponent={
          can_edit_info && (
            <Icon icon={'AngleRightB'} style={styles.rightIcon} />
          )
        }
      />

      <PrimaryItem
        testID="info_view.description"
        title={`settings:title_${type}_description`}
        titleProps={{useI18n: true}}
        subTitle={description}
        onPress={can_edit_info ? editDescription : undefined}
        RightComponent={
          can_edit_info && (
            <Icon icon={'AngleRightB'} style={styles.rightIcon} />
          )
        }
      />

      <PrimaryItem
        testID="info_view.privacy"
        title={'settings:title_privacy'}
        titleProps={{useI18n: true}}
        subTitle={titleCase(privacy) || ''}
        onPress={can_edit_privacy ? onPressPrivacy : undefined}
        RightComponent={
          can_edit_privacy && <Icon icon={'EditAlt'} style={styles.rightIcon} />
        }
      />
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing} = theme;
  return StyleSheet.create({
    container: {
      marginHorizontal: spacing.margin.tiny,
    },
    rightIcon: {
      marginLeft: spacing.margin.extraLarge,
    },
  });
};

export default InfoView;
