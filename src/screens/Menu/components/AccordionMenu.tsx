import React, { useRef, useState } from 'react';
import {
  View, StyleSheet, TouchableWithoutFeedback, Animated,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import Icon from '~/baseComponents/Icon';
import { IconType } from '~/resources/icons';
import { IAccordion } from '~/interfaces/IMenu';
import AccordionItem from './AccordionItem';

interface Props {
  testID: string;
  icon: IconType | number;
  title: string;
  listAccordion: IAccordion[];
}

const ITEM_HEIGHT = 48;

const AccordionMenu = ({
  testID, icon, title, listAccordion,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  const animationController = useRef(new Animated.Value(0)).current;

  const arrowTransform = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const listAccordionTransform = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: [0, listAccordion.length * ITEM_HEIGHT],
  });

  const onToggle = () => {
    const config = {
      duration: 300,
      toValue: isOpen ? 0 : 1,
      useNativeDriver: false,
    };
    Animated.timing(animationController, config).start();
    setIsOpen(!isOpen);
  };

  const renderItem = (item: IAccordion, index: number) => (
    <AccordionItem data={item} key={index} height={ITEM_HEIGHT} />
  );

  return (
    <>
      <TouchableWithoutFeedback testID={testID} onPress={onToggle}>
        <View style={styles.itemContainer}>
          <Icon tintColor={theme.colors.neutral20} size={22} icon={icon} />
          <Text.BodyMMedium style={styles.textTitle} numberOfLines={1}>
            {title}
          </Text.BodyMMedium>
          <Animated.View style={[styles.iconChevron, { transform: [{ rotateZ: arrowTransform }] }]}>
            <Icon tintColor={theme.colors.neutral40} size={14} icon="ChevronDown" />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.listAccordion, { height: listAccordionTransform }]}>
        {listAccordion.map(renderItem)}
      </Animated.View>
    </>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    textTitle: {
      flex: 1,
      marginLeft: spacing.margin.large,
      color: colors.neutral40,
    },
    itemContainer: {
      flexDirection: 'row',
      paddingVertical: spacing.padding.base,
    },
    iconChevron: {
      flexShrink: 1,
      marginLeft: spacing.margin.large,
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    listAccordion: {
      overflow: 'hidden',
    },
  });
};

export default AccordionMenu;
