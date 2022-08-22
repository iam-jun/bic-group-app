/* eslint-disable no-alert */
import React from 'react';
import { View } from 'react-native';
import { ComponentMeta } from '@storybook/react-native';

import TextInput from '.';
import { getStoryComponent } from '~/storybook';
import { dimension } from '~/theme';

export default {
  title: 'base/Form.TextInput',
  component: TextInput,
} as ComponentMeta<typeof TextInput>;

const OverView = (args) => (
  <View style={{ width: dimension.deviceWidth, paddingHorizontal: 16 }}>
    <TextInput {...args} />
  </View>
);

const StoryComponent = getStoryComponent(OverView);

export const Default = StoryComponent.bind({});
Default.args = {
  placeholder: 'Text placeholder',
  label: 'Input Label',
  helperText: 'Example help text that remains unchanged.',
  editable: true,
  horizontal: false,
  error: false,
  leftIcon: 'Sitemap',
  style: { marginRight: 16 },
};
Default.storyName = 'Text Input';
