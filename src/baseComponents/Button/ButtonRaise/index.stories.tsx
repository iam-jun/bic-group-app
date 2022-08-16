import React from 'react';
import { View } from 'react-native';
import { ComponentMeta } from '@storybook/react-native';
import ButtonRaise from '.';
import { getStoryComponent } from '~/storybook';
import { light } from '~/theme/theme';
import { ButtonSize } from '~/baseComponents/Button/interface';

const ButtonRaiseStory = {
  title: 'base/Button.Raise',
  component: ButtonRaise,
} as ComponentMeta<typeof ButtonRaise>

export const baseProps = {
  onPress: () => alert('Button Pressed!'),
  size: 'medium' as ButtonSize,
  icon: 'iconPublic' as any,
  color: light.colors.neutral70,
  backgroundColor: light.colors.neutral,
  children: 'Public Group',
  style: { marginVertical: 8, marginHorizontal: 8 },
}

const testProps = {
  textOnly: {
    ...baseProps,
    icon: undefined,
  },
  iconOnly: {
    ...baseProps,
    children: undefined,
  },
}

const styles: any = {
  row: { flexDirection: 'row', marginVertical: 8 },
}

const ComponentOverview = () => (
  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
    <View style={styles.row}>
      <ButtonRaise {...testProps.textOnly} size="large" color={light.colors.purple50} />
      <ButtonRaise {...baseProps} size="large" color={light.colors.purple50} />
      <ButtonRaise {...testProps.iconOnly} size="large" color={light.colors.purple50} />
    </View>
    <View style={styles.row}>
      <ButtonRaise {...testProps.textOnly} size="medium" color={light.colors.blue50} />
      <ButtonRaise {...baseProps} size="medium" color={light.colors.blue50} />
      <ButtonRaise {...testProps.iconOnly} size="medium" color={light.colors.blue50} />
    </View>
    <View style={styles.row}>
      <ButtonRaise {...testProps.textOnly} size="small" color={light.colors.green50} />
      <ButtonRaise {...baseProps} size="small" color={light.colors.green50} />
      <ButtonRaise {...testProps.iconOnly} size="small" color={light.colors.green50} />
    </View>
  </View>
);
export const All_Overview = getStoryComponent(ComponentOverview).bind({});

const StoryComponent = getStoryComponent(ButtonRaise);

export const Default = StoryComponent.bind({});
Default.args = {
  ...baseProps,
}

export default ButtonRaiseStory
