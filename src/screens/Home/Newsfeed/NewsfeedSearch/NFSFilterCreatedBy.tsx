import React, {FC} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Divider from '~/beinComponents/Divider';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Icon from '~/beinComponents/Icon';
import {useBaseHook} from '~/hooks';
import Button from '~/beinComponents/Button';
import {useDispatch} from 'react-redux';
import modalActions from '~/store/modal/actions';
import {useUserIdAuth} from '~/hooks/auth';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export interface NFSFilterCreatedByProps {
  selectedCreatedBy?: any;
  onSelect?: (selected?: any) => void;
}

const NFSFilterCreatedBy: FC<NFSFilterCreatedByProps> = ({
  selectedCreatedBy,
  onSelect,
}: NFSFilterCreatedByProps) => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const insets = useSafeAreaInsets();
  const styles = createStyle(theme, insets);
  const userId = useUserIdAuth();

  const _onSelect = (selected?: any) => {
    dispatch(modalActions.hideModal());
    onSelect?.(selected);
  };

  const renderSpecificRightComponent = () => {
    return (
      <Button.Secondary
        style={styles.buttonSpecificRight}
        textColor={colors.primary6}>
        {t('home:newsfeed_search:choose_creator')}
      </Button.Secondary>
    );
  };

  return (
    <View style={styles.container}>
      <Text.ButtonSmall style={styles.textHeader}>
        {t('home:newsfeed_search:choose_creator')}
      </Text.ButtonSmall>
      <Divider style={styles.divider} />
      <PrimaryItem
        height={40}
        onPress={() => _onSelect()}
        style={styles.itemContainer}
        title={t('home:newsfeed_search:filter_created_by_all')}
        RightComponent={
          !selectedCreatedBy && (
            <Icon icon={'Check'} size={20} tintColor={colors.primary7} />
          )
        }
      />
      <PrimaryItem
        height={40}
        onPress={() => _onSelect({id: userId, name: ''})}
        style={styles.itemContainer}
        title={t('home:newsfeed_search:filter_created_by_me')}
        RightComponent={
          selectedCreatedBy?.id === userId ? (
            <Icon icon={'Check'} size={20} tintColor={colors.primary7} />
          ) : undefined
        }
      />
      <PrimaryItem
        height={48}
        style={styles.itemContainer}
        title={t('home:newsfeed_search:filter_created_by_specific')}
        RightComponent={renderSpecificRightComponent()}
      />
    </View>
  );
};

const createStyle = (theme: ITheme, insets: any) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingBottom:
        Platform.OS === 'web'
          ? spacing.padding.tiny
          : spacing.padding.extraLarge + insets?.bottom,
    },
    itemContainer: {
      paddingHorizontal: spacing.padding.extraLarge,
    },
    divider: {
      marginVertical: spacing.margin.small,
    },
    textHeader: {
      color: colors.textSecondary,
      marginVertical: spacing.margin.tiny,
      marginHorizontal: spacing.margin.extraLarge,
    },
    buttonSpecificRight: {
      marginLeft:
        Platform.OS === 'web' ? spacing.margin.extraLarge : spacing.margin.tiny,
    },
  });
};

export default NFSFilterCreatedBy;
