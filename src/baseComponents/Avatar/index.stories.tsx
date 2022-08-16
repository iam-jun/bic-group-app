/* eslint-disable no-alert */
import { ComponentMeta } from '@storybook/react-native';
import Avatar from '.';
import { getStoryComponent } from '~/storybook';
import images from '~/resources/images';

export default {
  title: 'base/Avatar',
  component: Avatar,
  argTypes: {
    variant: {
      control: {
        type: 'select',
      },
      options: ['tiny', 'xSmall', 'small', 'base', 'medium', 'large', 'xLarge'],
    },
    type: {
      options: ['primary', 'secondary', 'neutral'],
      control: {
        type: 'select',
      },
    },
  },
} as ComponentMeta<typeof Avatar>;

const StoryComponent = getStoryComponent(Avatar);

export const Base = StoryComponent.bind({});
Base.args = {
  variant: 'base',
  source: images.img_user_avatar_default,
}

export const Rounded = StoryComponent.bind({});
Rounded.args = {
  variant: 'base',
  source: images.img_user_avatar_default,
  isRounded: true,
}

export const Online = StoryComponent.bind({});
Online.args = {
  variant: 'base',
  status: 'online',
  source: images.img_user_avatar_default,
  isRounded: true,
}

export const Bagde = StoryComponent.bind({});
Bagde.args = {
  variant: 'base',
  source: images.img_user_avatar_default,
  isRounded: true,
  badgeCheck: true,
}

export const Action = StoryComponent.bind({});
Action.args = {
  variant: 'base',
  source: images.img_user_avatar_default,
  isRounded: true,
  actionIcon: 'edit',
  onPressAction: () => { alert('onPressAction') },
}
