import {StyleSheet, View} from 'react-native';
import React from 'react';

import {useRootNavigation} from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';
import {titleCase} from '~/utils/common';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Icon from '~/beinComponents/Icon';
import spacing from '~/theme/spacing';

interface Props {
  id: string;
  onPressPrivacy?: () => void;
  name: string;
  description: string;
  privacy: string;
  canEditPrivacy: boolean;
  canEditInfo: boolean;
  type: 'community' | 'group';
}

const InfoView = ({
  id,
  onPressPrivacy,
  name,
  description,
  privacy,
  canEditInfo,
  canEditPrivacy,
  type,
}: Props) => {
  const {rootNavigation} = useRootNavigation();

  const editDescription = () => {
    rootNavigation.navigate(groupStack.editDescription, {
      id,
      description,
      type,
    });
  };

  const editName = () => {
    rootNavigation.navigate(groupStack.editName, {
      id,
      name,
      type,
    });
  };

  return (
    <View style={styles.container}>
      <PrimaryItem
        testID="info_view.name"
        title={`settings:title_${type}_name`}
        titleProps={{useI18n: true}}
        subTitle={name}
        onPress={canEditInfo ? editName : undefined}
        RightComponent={
          canEditInfo && (
            <Icon icon={'AngleRightSolid'} style={styles.rightIcon} />
          )
        }
      />

      <PrimaryItem
        testID="info_view.description"
        title={`settings:title_${type}_description`}
        titleProps={{useI18n: true}}
        subTitle={description}
        onPress={canEditInfo ? editDescription : undefined}
        RightComponent={
          canEditInfo && (
            <Icon icon={'AngleRightSolid'} style={styles.rightIcon} />
          )
        }
      />

      <PrimaryItem
        testID="info_view.privacy"
        title={'settings:title_privacy'}
        titleProps={{useI18n: true}}
        subTitle={titleCase(privacy) || ''}
        onPress={canEditPrivacy ? onPressPrivacy : undefined}
        RightComponent={
          canEditPrivacy && <Icon icon={'PenLine'} style={styles.rightIcon} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.margin.tiny,
  },
  rightIcon: {
    marginLeft: spacing.margin.extraLarge,
  },
});

export default InfoView;
