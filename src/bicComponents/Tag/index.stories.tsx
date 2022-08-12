import React from 'react';
import { ComponentMeta } from '@storybook/react';

import Tag from '.';
import CenterView from '../CenterView';

const avatarUrl = 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/close-up-of-cat-wearing-sunglasses-while-sitting-royalty-free-image-1571755145.jpg';

export default {
  title: 'components/Tag',
  component: Tag,
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['small', 'medium', 'large'],
    },
    type: {
      options: ['primary', 'secondary', 'neutral'],
      control: {
        type: 'select',
      },
    },
  },
} as ComponentMeta<typeof Tag>;

// 👇 We create a “template” of how args map to rendering
const Template = (args) => (
  <CenterView>
    <Tag {...args} />
  </CenterView>
);

// 👇 Each story then reuses that template
export const TextOnly = Template.bind({});
TextOnly.args = {
  label: 'tag label',
  size: 'small',
  type: 'primary',
  style: {},
  disable: false,
  onActionPress: () => {
    alert('onActionPress');
  },
  onPressIcon: () => { alert('onPressIcon'); },
};

export const NameTag = Template.bind({});
NameTag.args = { ...TextOnly.args, icon: 'Xmark', label: 'Name Tag' };

export const AvatarTag = Template.bind({});
AvatarTag.args = {
  ...TextOnly.args, avatar: avatarUrl, icon: 'Xmark', label: 'Avatar Tag',
};
