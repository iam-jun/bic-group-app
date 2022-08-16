/* eslint-disable no-alert */
import React from 'react';
import { View } from 'react-native';
import TextInput from './TextInput';

import { ComponentMeta, getStoryComponent } from '~/storybook';
import dimension from '~/theme/dimension';

export default {
  title: 'components/Form',
  component: TextInput,
} as ComponentMeta<typeof TextInput>;

const OverView = (args) => (
  <View style={{ width: dimension.deviceWidth, paddingHorizontal: 16 }}>
    <TextInput {...args} />
  </View>
)

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
}
Default.storyName = 'Text Input';
