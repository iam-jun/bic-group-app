import React, {FC, useContext, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Divider from '~/beinComponents/Divider';
import {useBaseHook} from '~/hooks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Button from '~/beinComponents/Button';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import modalActions from '~/store/modal/actions';
import {useDispatch} from 'react-redux';
import {formatDateTime} from '~/beinComponents/TimeView';
import {useUserIdAuth} from '~/hooks/auth';
import {AppContext} from '~/contexts/AppContext';
import homeActions from '~/screens/Home/redux/actions';
import NFSFilterCreatedBy from '~/screens/Home/Newsfeed/NewsfeedSearch/NFSFilterCreatedBy';
import {ISelectedFilterUser} from '~/interfaces/IHome';
import NFSFilterDate from '~/screens/Home/Newsfeed/NewsfeedSearch/NFSFilterDate';
import NFSFilterCreateBySpecific from '~/screens/Home/Newsfeed/NewsfeedSearch/NFSFilterCreateBySpecific';

export interface NFSFilterOptionMenuProps {
  filterCreatedBy?: any;
  filterDate?: any;
}

const Stage = {
  MENU: 'MENU',
  FILTER_DATE: 'FILTER_DATE',
  FILTER_CREATOR: 'FILTER_CREATOR',
  FILTER_CREATOR_SPECIFIC: 'FILTER_CREATOR_SPECIFIC',
};

const NFSFilterOptionMenu: FC<NFSFilterOptionMenuProps> = ({
  filterCreatedBy,
  filterDate,
}: NFSFilterOptionMenuProps) => {
  const [stage, setStage] = useState(Stage.MENU);
  const [createdBy, setCreatedBy] = useState(filterCreatedBy);
  const [date, setDate] = useState(filterDate);

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const insets = useSafeAreaInsets();
  const styles = createStyle(theme, insets);
  const userId = useUserIdAuth();
  const {language} = useContext(AppContext);

  const {startDate, endDate} = date || {};

  const textCreatedBy = createdBy
    ? createdBy?.id === userId
      ? t('home:newsfeed_search:filter_created_by_me')
      : `${createdBy?.name}`
    : t('home:newsfeed_search:label_anyone');
  const textDate = date
    ? `${formatDateTime(startDate, t, language)} - ${formatDateTime(
        endDate,
        t,
        language,
      )}`
    : t('home:newsfeed_search:label_anytime');

  const _onPressApply = () => {
    dispatch(modalActions.hideModal());
    dispatch(homeActions.setNewsfeedSearchFilter({date, createdBy}));
  };

  const _onPressDate = () => {
    setStage(Stage.FILTER_DATE);
  };

  const _onSelectDate = (startDate?: string, endDate?: string) => {
    if (startDate && endDate) {
      setDate({startDate, endDate});
    }
    setStage(Stage.MENU);
  };

  const _onPressCreatedBy = () => {
    setStage(Stage.FILTER_CREATOR);
  };

  const _onSelectCreatedBy = (selected?: ISelectedFilterUser) => {
    setCreatedBy(selected);
    setStage(Stage.MENU);
  };

  const _onPressReset = () => {
    setCreatedBy(undefined);
    setDate(undefined);
  };

  const _onPressSelectSpecific = () => {
    setStage(Stage.FILTER_CREATOR_SPECIFIC);
  };

  if (stage === Stage.FILTER_CREATOR) {
    return (
      <NFSFilterCreatedBy
        selectedCreatedBy={filterCreatedBy}
        onSelect={_onSelectCreatedBy}
        onPressSelectSpecific={_onPressSelectSpecific}
      />
    );
  } else if (stage === Stage.FILTER_DATE) {
    return (
      <NFSFilterDate
        startDate={startDate}
        endDate={endDate}
        onSelect={_onSelectDate}
      />
    );
  } else if (stage === Stage.FILTER_CREATOR_SPECIFIC) {
    return <NFSFilterCreateBySpecific onSelect={_onSelectCreatedBy} />;
  }

  return (
    <TouchableOpacity activeOpacity={1} style={styles.container}>
      <View style={styles.header}>
        <Text.ButtonSmall style={styles.textHeader}>
          {t('home:newsfeed_search:label_all_filters')}
        </Text.ButtonSmall>
        <Button
          onPress={_onPressReset}
          style={{justifyContent: 'center', alignSelf: 'center'}}>
          <Text.ButtonSmall style={styles.btnReset}>
            {t('home:newsfeed_search:btn_reset').toUpperCase()}
          </Text.ButtonSmall>
        </Button>
      </View>
      <Divider style={styles.divider} />
      <PrimaryItem
        height={60}
        onPress={_onPressCreatedBy}
        style={styles.itemContainer}
        title={t('home:newsfeed_search:label_creator')}
        subTitle={textCreatedBy}
        subTitleProps={{color: colors.primary6}}
        RightComponent={
          createdBy && (
            <Button.Secondary
              onPress={() => setCreatedBy(undefined)}
              color={colors.surface}
              style={styles.buttonRight}>
              {t('home:newsfeed_search:btn_reset')}
            </Button.Secondary>
          )
        }
      />
      <PrimaryItem
        height={60}
        onPress={_onPressDate}
        style={styles.itemContainer}
        title={t('home:newsfeed_search:label_creation_date')}
        subTitle={textDate}
        subTitleProps={{color: colors.primary6}}
        RightComponent={
          date && (
            <Button.Secondary
              onPress={() => setDate(undefined)}
              color={colors.surface}
              style={styles.buttonRight}>
              {t('home:newsfeed_search:btn_reset')}
            </Button.Secondary>
          )
        }
      />
      <Button.Primary
        onPress={_onPressApply}
        style={styles.buttonApply}
        color={colors.primary6}>
        {t('home:newsfeed_search:btn_show_results')}
      </Button.Primary>
    </TouchableOpacity>
  );
};

const createStyle = (theme: ITheme, insets: any) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingBottom:
        Platform.OS === 'web'
          ? spacing.padding.tiny
          : spacing.padding.extraLarge,
      minWidth: Platform.OS === 'web' ? 300 : undefined,
    },
    divider: {
      marginVertical: spacing.margin.small,
    },
    textHeader: {
      flex: 1,
      color: colors.textSecondary,
      marginTop:
        Platform.OS === 'web' ? spacing.margin.base : spacing.margin.tiny,
      marginBottom: spacing.margin.tiny,
      marginHorizontal: spacing.margin.extraLarge,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    btnReset: {
      color: colors.primary6,
      marginRight: spacing.margin.extraLarge,
    },
    itemContainer: {
      paddingHorizontal: spacing.padding.extraLarge,
    },
    buttonRight: {
      marginLeft:
        Platform.OS === 'web' ? spacing.margin.extraLarge : spacing.margin.tiny,
    },
    buttonApply: {
      marginHorizontal: spacing.margin.extraLarge,
      marginVertical: spacing.margin.small,
    },
  });
};

export default NFSFilterOptionMenu;
