import React, {FC, useContext, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

import Button from '~/beinComponents/Button';
import Divider from '~/beinComponents/Divider';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Text from '~/beinComponents/Text';
import {formatDateTime} from '~/beinComponents/TimeView';

import {AppContext} from '~/contexts/AppContext';
import {useBaseHook} from '~/hooks';
import {useUserIdAuth} from '~/hooks/auth';
import {ISelectedFilterUser} from '~/interfaces/IHome';
import NFSFilterCreateBySpecific from './NFSFilterCreateBySpecific';
import NFSFilterCreatedBy from './NFSFilterCreatedBy';
import NFSFilterDate from './NFSFilterDate';
import homeActions from '../../redux/actions';
import modalActions from '~/store/modal/actions';
import spacing from '~/theme/spacing';

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
  const theme: ExtendedTheme = useTheme();
  const {colors} = theme;
  const styles = createStyle(theme);
  const userId = useUserIdAuth();
  const {language} = useContext(AppContext);

  const {startDate, endDate} = date || {};

  const textCreatedBy = createdBy
    ? createdBy?.id === userId
      ? t('home:newsfeed_search:filter_created_by_me')
      : `${createdBy?.name}`
    : t('home:newsfeed_search:label_anyone');

  const textDate = date
    ? `${formatDateTime(startDate, language)} - ${formatDateTime(
        endDate,
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
        <Text.ButtonS style={styles.textHeader}>
          {t('home:newsfeed_search:label_all_filters')}
        </Text.ButtonS>
        <Button
          onPress={_onPressReset}
          style={{justifyContent: 'center', alignSelf: 'center'}}>
          <Text.ButtonS style={styles.btnReset}>
            {t('home:newsfeed_search:btn_reset').toUpperCase()}
          </Text.ButtonS>
        </Button>
      </View>
      <Divider style={styles.divider} />
      <PrimaryItem
        height={60}
        onPress={_onPressCreatedBy}
        style={styles.itemContainer}
        title={t('home:newsfeed_search:label_creator')}
        subTitle={textCreatedBy}
        subTitleProps={{color: colors.purple50}}
        RightComponent={
          createdBy && (
            <Button.Secondary
              onPress={() => setCreatedBy(undefined)}
              color={colors.neutral1}
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
        subTitleProps={{color: colors.purple50}}
        RightComponent={
          date && (
            <Button.Secondary
              onPress={() => setDate(undefined)}
              color={colors.neutral1}
              style={styles.buttonRight}>
              {t('home:newsfeed_search:btn_reset')}
            </Button.Secondary>
          )
        }
      />
      <Button.Primary
        onPress={_onPressApply}
        style={styles.buttonApply}
        color={colors.purple50}>
        {t('home:newsfeed_search:btn_show_results')}
      </Button.Primary>
    </TouchableOpacity>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      paddingBottom: spacing.padding.extraLarge,
    },
    divider: {
      marginVertical: spacing.margin.small,
    },
    textHeader: {
      flex: 1,
      color: colors.gray50,
      marginTop: spacing.margin.tiny,
      marginBottom: spacing.margin.tiny,
      marginHorizontal: spacing.margin.extraLarge,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    btnReset: {
      color: colors.purple50,
      marginRight: spacing.margin.extraLarge,
    },
    itemContainer: {
      paddingHorizontal: spacing.padding.extraLarge,
    },
    buttonRight: {
      marginLeft: spacing.margin.tiny,
    },
    buttonApply: {
      marginHorizontal: spacing.margin.extraLarge,
      marginVertical: spacing.margin.small,
    },
  });
};

export default NFSFilterOptionMenu;
