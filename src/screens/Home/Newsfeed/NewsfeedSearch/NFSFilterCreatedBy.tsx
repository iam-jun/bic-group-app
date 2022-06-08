import React, {FC} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import Button from '~/beinComponents/Button';
import Divider from '~/beinComponents/Divider';
import Icon from '~/beinComponents/Icon';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import Text from '~/beinComponents/Text';
import {useBaseHook} from '~/hooks';
import {useUserIdAuth} from '~/hooks/auth';
import {ISelectedFilterUser} from '~/interfaces/IHome';
import NFSFilterCreateBySpecific from '~/screens/Home/Newsfeed/NewsfeedSearch/NFSFilterCreateBySpecific';
import modalActions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';

export interface NFSFilterCreatedByProps {
  selectedCreatedBy?: any;
  onSelect?: (selected?: ISelectedFilterUser) => void;
  onPressSelectSpecific?: () => void;
  dismissModalOnPress?: boolean;
}

const NFSFilterCreatedBy: FC<NFSFilterCreatedByProps> = ({
  selectedCreatedBy,
  onSelect,
  onPressSelectSpecific,
  dismissModalOnPress,
}: NFSFilterCreatedByProps) => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);
  const userId = useUserIdAuth();

  const _onSelect = (selected?: any) => {
    dismissModalOnPress && dispatch(modalActions.hideModal());
    onSelect?.(selected);
  };

  const _onPressSelectSpecific = () => {
    if (onPressSelectSpecific) {
      onPressSelectSpecific?.();
    } else {
      dismissModalOnPress && dispatch(modalActions.hideModal());
      dispatch(
        modalActions.showModal({
          isOpen: true,
          ContentComponent: (
            <NFSFilterCreateBySpecific
              onSelect={_onSelect}
              dismissModalOnPress
            />
          ),
        }),
      );
    }
  };

  const renderSpecificRightComponent = () => {
    return (
      <Button.Secondary
        onPress={_onPressSelectSpecific}
        style={styles.buttonSpecificRight}
        textColor={colors.primary6}
        rightIcon={selectedCreatedBy?.name && 'EditAlt'}>
        {selectedCreatedBy?.name || t('home:newsfeed_search:choose_creator')}
      </Button.Secondary>
    );
  };

  return (
    <TouchableOpacity activeOpacity={1} style={styles.container}>
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
        height={52}
        style={styles.itemContainer}
        title={t('home:newsfeed_search:filter_created_by_specific')}
        RightComponent={renderSpecificRightComponent()}
      />
    </TouchableOpacity>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingBottom: spacing.padding.extraLarge,
    },
    itemContainer: {
      paddingHorizontal: spacing.padding.extraLarge,
    },
    divider: {
      marginVertical: spacing.margin.small,
    },
    textHeader: {
      color: colors.textSecondary,
      marginTop: spacing.margin.tiny,
      marginBottom: spacing.margin.tiny,
      marginHorizontal: spacing.margin.extraLarge,
    },
    buttonSpecificRight: {
      marginLeft: spacing.margin.tiny,
    },
  });
};

export default NFSFilterCreatedBy;
