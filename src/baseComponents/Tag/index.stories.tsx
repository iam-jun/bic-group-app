/* eslint-disable no-alert */
import { ComponentMeta } from '@storybook/react-native';
import { getStoryComponent } from '~/storybook';
import Tag from '.';

const avatarUrl = 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/close-up-of-cat-wearing-sunglasses-while-sitting-royalty-free-image-1571755145.jpg';

export default {
  title: 'base/Tag',
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

const StoryComponent = getStoryComponent(Tag);

// 👇 Each story then reuses that template
export const TextOnly = StoryComponent.bind({});
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

export const NameTag = StoryComponent.bind({});
NameTag.args = { ...TextOnly.args, icon: 'Xmark', label: 'Name Tag' };

export const AvatarTag = StoryComponent.bind({});
AvatarTag.args = {
  ...TextOnly.args, avatar: avatarUrl, icon: 'Xmark', label: 'Avatar Tag',
};
