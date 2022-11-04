import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import spacing from '~/theme/spacing';
import { useBaseHook } from '~/hooks';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const contentHeight = SCREEN_HEIGHT * 0.2;

const AlertDeleteAudiencesConfirmContent = ({ data, textContent }:{ data: any[], textContent:string, }) => {
  const theme: ExtendedTheme = useTheme();
  const [showAll, setShowAll] = useState(false);
  const { t } = useBaseHook();

  const renderItem = (item: any, index: number) => (
    <View
      key={`alert_assign_group_confirm.item_${index}`}
      style={styles.itemContainer}
    >
      <Text.ButtonM numberOfLines={1} color={theme.colors.neutral70}>
        {' '}
        •
        {` ${item.name}`}
      </Text.ButtonM>
    </View>
  );

  if (!data?.length) return null;
  if (data.length > 3 && !showAll) {
    return (
      <View style={styles.container}>
        <Text.BodyM>{textContent}</Text.BodyM>
        <View style={styles.contentContainer}>
          <ScrollView>
            <TouchableOpacity>
              {data?.slice(0, 3)?.map?.(renderItem)}
              <View
                style={styles.itemContainer}
              >
                <Text.ButtonM onPress={() => { setShowAll(true); }} color={theme.colors.neutral70}>
                  {' '}
                  •
                  {` +${data.length - 3} ${t('post:more_group')}`}
                </Text.ButtonM>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text.BodyM>{textContent}</Text.BodyM>
      <View style={styles.contentContainer}>
        <ScrollView>
          <TouchableOpacity>
            {data?.map?.(renderItem)}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.padding.large,
    paddingTop: spacing.padding.tiny,
  },
  itemContainer: {
    marginTop: spacing.margin.base,
  },
  contentContainer: {
    height: contentHeight,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.margin.base,
  },
});

export default AlertDeleteAudiencesConfirmContent;
