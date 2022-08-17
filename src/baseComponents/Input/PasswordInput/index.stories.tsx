/* eslint-disable no-alert */
import React from 'react';
import { View } from 'react-native';
import { ComponentMeta } from '@storybook/react-native';

import PasswordInput from '.';
import { getStoryComponent } from '~/storybook';

export default {
  title: 'base/Form.PasswordInput',
  component: PasswordInput,
} as ComponentMeta<typeof PasswordInput>;

const OverView = (args) => (
  <View style={{ paddingHorizontal: 16 }}>
    <PasswordInput {...args} />
  </View>
)

const StoryComponent = getStoryComponent(OverView);

export const Default = StoryComponent.bind({});
Default.args = {
  placeholder: 'Text placeholder',
  label: 'Input Label',
  helperText: '',
  horizontal: false,
  error: false,
  style: { marginRight: 16 },
}
