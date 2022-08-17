/* eslint-disable no-alert */
import React from 'react';
import { View } from 'react-native';
import { ComponentMeta } from '@storybook/react-native';

import TextArea from '.';
import { getStoryComponent } from '~/storybook';

export default {
  title: 'base/Form.TextArea',
  component: TextArea,
} as ComponentMeta<typeof TextArea>;

const OverView = (args) => (
  <View style={{ paddingHorizontal: 16 }}>
    <TextArea {...args} />
  </View>
)

const StoryComponent = getStoryComponent(OverView);

export const Default = StoryComponent.bind({});
Default.args = {
  placeholder: 'Text placeholder',
  label: 'Input Label',
}
Default.storyName = 'Default';
