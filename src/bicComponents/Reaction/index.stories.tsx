import React from 'react';
import { ComponentMeta } from '@storybook/react-native';

import Reaction from '.';
import CenterView from '../CenterView';

export default {
  title: 'components/Reaction',
  component: Reaction,
} as ComponentMeta<typeof Reaction>;

const Template = (args) => (
  <CenterView>
    <Reaction {...args} />
  </CenterView>
);

export const Default = Template.bind({});
Default.args = {
  value: 10,
  icon: 'kissing_closed_eyes',
  selected: false,
  onActionPress: () => { alert('onActionPress') },
  onLongPress: () => { alert('onLongPress') },
}

export const Loading = Template.bind({});
Loading.args = {
  ...Default.args,
  selected: true,
  loading: true,
}
