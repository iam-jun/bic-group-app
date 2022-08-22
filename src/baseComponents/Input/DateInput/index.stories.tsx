/* eslint-disable no-alert */
import React from 'react';
import { View } from 'react-native';
import { ComponentMeta } from '@storybook/react-native';

import DateInput from '.';
import { getStoryComponent } from '~/storybook';

export default {
  title: 'base/Form.DateInput',
  component: DateInput,
  argTypes: {
    mode: {
      control: {
        type: 'select',
      },
      options: ['date', 'time'],
    },
  },
} as ComponentMeta<typeof DateInput>;

const OverView = (args) => (
  <View style={{ paddingHorizontal: 16 }}>
    <DateInput {...args} />
  </View>
);

const StoryComponent = getStoryComponent(OverView);

export const Default = StoryComponent.bind({});
Default.args = {
  placeholder: '',
  label: 'Input Label',
  style: { marginRight: 16 },
  outlineColor: undefined,
  mode: 'date',
  onConfirm: (date) => { alert(`ON CONFIRM DATE ${date}`); },
};
