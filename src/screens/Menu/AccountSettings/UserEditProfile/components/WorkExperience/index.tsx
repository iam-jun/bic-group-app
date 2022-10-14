import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Icon from '~/baseComponents/Icon';
import { useBaseHook } from '~/hooks';
import Text from '~/beinComponents/Text';
import { IUserWorkExperience } from '~/interfaces/IAuth';
import { formatDate } from '~/utils/formatData';
import Divider from '~/beinComponents/Divider';
import Button from '~/beinComponents/Button';
import { spacing } from '~/theme';
import menuActions from '~/storeRedux/menu/actions';
import { useRootNavigation } from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';
import { useKeySelector } from '~/hooks/selector';
import menuKeySelector from '~/storeRedux/menu/keySelector';

const WorkExperience = () => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles();
  const { rootNavigation } = useRootNavigation();
  const dispatch = useDispatch();
  const myWorkExperience = useKeySelector(menuKeySelector.myWorkExperience);

  const selectWorkItem = (item: IUserWorkExperience) => {
    dispatch(menuActions.setSelectedWorkItem(item));
    rootNavigation.navigate(mainStack.addWork);
  };

  const goToAddWork = () => {
    dispatch(menuActions.setSelectedWorkItem(null));
    rootNavigation.navigate(mainStack.addWork);
  };

  const renderWorkItem = ({ item }: {item: IUserWorkExperience}) => {
    const startWorkTime = formatDate(item.startDate, 'MMM Do, YYYY');
    const endWorkTime = item?.currentlyWorkHere
      ? t('common:text_present')
      : formatDate(item.endDate, 'MMM Do, YYYY');

    const timeWork = `${startWorkTime} ${t('common:text_to')} ${endWorkTime}`;

    return (
      <PrimaryItem
        testID="work_experience.item"
        leftIcon="iconSuitcase"
        leftIconProps={{
          icon: 'iconSuitcase',
          size: 24,
        }}
        RightComponent={<Icon icon="PenLine" size={20} />}
        ContentComponent={(
          <View>
            <Text.ButtonM>
              {`${item?.titlePosition} ${t('common:text_at')} ${item?.company}`}
            </Text.ButtonM>
            {!!item?.startDate && <Text>{timeWork}</Text>}
            {!!item?.location && (
              <Text.BodyS color={colors.gray50}>{item.location}</Text.BodyS>
            )}
            {!!item?.description && (
              <Text.BodyS numberOfLines={3} color={colors.gray50}>
                {item.description}
              </Text.BodyS>
            )}
          </View>
      )}
        onPress={() => selectWorkItem(item)}
      />
    );
  };

  return (
    <View>
      <Divider style={styles.divider} />
      <View style={styles.headerItem}>
        <Text.BodyM color={colors.neutral80} useI18n>
          settings:text_work
        </Text.BodyM>
      </View>
      <View style={styles.infoItem}>
        {(myWorkExperience || [])?.map((item: IUserWorkExperience) => (
          <View key={`${item?.id} ${item?.company} ${item?.titlePosition}`}>
            {renderWorkItem({ item })}
          </View>
        ))}
      </View>
      <Button.Secondary
        color={colors.violet1}
        textColor={colors.purple50}
        onPress={goToAddWork}
        style={styles.buttonAddWork}
        testID="work_experience.add_work"
      >
        {t('settings:text_add_work')}
      </Button.Secondary>
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  headerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: spacing.padding.base,
    paddingVertical: spacing.padding.small,
    paddingLeft: spacing.padding.large,
    alignItems: 'center',
  },
  infoItem: {
    marginHorizontal: spacing.margin.tiny,
  },
  divider: {
    marginVertical: spacing.margin.small,
  },
  buttonAddWork: {
    marginHorizontal: spacing.margin.large,
    marginVertical: spacing.margin.base,
  },
});

export default WorkExperience;
