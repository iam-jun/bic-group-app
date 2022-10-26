import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
import Text from '~/beinComponents/Text';
import { useBaseHook } from '~/hooks';
import { IUserWorkExperience } from '~/interfaces/IAuth';
import { spacing } from '~/theme';
import { formatDate } from '~/utils/formatData';
import { getEndDateText } from '../../helper';
import InfoItem from '../InfoItem';
import EditButton from '../../components/EditButton';
import ViewSpacing from '~/beinComponents/ViewSpacing';
import DeleteButton from '../DeleteButton';
import menuActions from '~/storeRedux/menu/actions';
import { useRootNavigation } from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';

type ItemExperienceProps = {
  item: IUserWorkExperience;
  isCurrentUser: boolean;
};

const ItemExperience: FC<ItemExperienceProps> = ({
  item,
  isCurrentUser,
}) => {
  const {
    id,
    company,
    titlePosition,
    startDate,
    currentlyWorkHere,
    endDate,
    location,
    description,
  } = item;
  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { rootNavigation } = useRootNavigation();

  const editItemExperience = () => {
    dispatch(menuActions.setSelectedWorkItem(item));
    rootNavigation.navigate(mainStack.addWork);
  };

  const deleteItemExperience = () => {
    dispatch(menuActions.deleteWorkExperience(
      id,
    ));
  };

  return (
    <View testID="item_experience">
      <View style={styles.row}>
        <View style={styles.titleCompany}>
          <View style={styles.titleLine} />
          <Text.SubtitleL color={theme.colors.neutral20}>
            {`${t('settings:text_work')} ${t('common:text_at')} `}
            <Text.SubtitleL>{company}</Text.SubtitleL>
          </Text.SubtitleL>
        </View>
        <View style={styles.rowAction}>
          <DeleteButton
            isCurrentUser={isCurrentUser}
            onPress={deleteItemExperience}
            icon="TrashCanSolid"
          />
          <ViewSpacing width={spacing.margin.small} />
          <EditButton
            isCurrentUser={isCurrentUser}
            onPress={editItemExperience}
            icon="PenToSquareSolid"
          />
        </View>
      </View>
      <InfoItem title="settings:text_title_position" value={titlePosition} />
      <InfoItem title="settings:title_location" value={location} />
      <InfoItem
        title="common:text_start_date"
        value={formatDate(startDate, 'MMM D, YYYY')}
      />
      <InfoItem
        title="common:text_end_date"
        value={getEndDateText(t, currentlyWorkHere, endDate)}
      />
      <InfoItem
        title="common:text_description"
        value={description}
      />
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    titleCompany: {
      flexDirection: 'row',
      flex: 1,
      marginRight: spacing.margin.small,
    },
    titleLine: {
      width: 1,
      height: 22,
      backgroundColor: colors.neutral20,
      marginRight: spacing.padding.base,
    },
    infoItem: {
      paddingBottom: spacing.padding.large,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: spacing.padding.large,
    },
    rowAction: {
      marginLeft: spacing.margin.base,
      flexDirection: 'row',
    },
  });
};

export default ItemExperience;
