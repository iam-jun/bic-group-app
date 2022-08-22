import { ComponentMeta } from '@storybook/react-native';
import { ButtonComponent } from '.';
import { getStoryComponent } from '~/storybook';

export default {
  title: 'base/Button',
  component: ButtonComponent,
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['small', 'medium', 'large'],
    },
    type: {
      control: {
        type: 'select',
      },
      options: ['solid', 'ghost'],
    },
    variant: {
      options: ['primary', 'secondary', 'neutral', 'success', 'danger'],
      control: {
        type: 'select',
      },
    },
  },
} as ComponentMeta<typeof ButtonComponent>;

const StoryComponent = getStoryComponent(ButtonComponent);

export const TextOnly = StoryComponent.bind({});
TextOnly.args = {
  variant: 'primary',
  type: 'solid',
  size: 'medium',
  disabled: false,
  loading: false,
  children: 'Button Component',
  onPress: () => { alert('onPress'); },
  onLongPress: () => { alert('onLongPress'); },
};

export const TextWithIcon = StoryComponent.bind({});
TextWithIcon.args = {
  ...TextOnly.args,
  icon: 'iconReact',
};

export const IconOnly = StoryComponent.bind({});
IconOnly.args = {
  ...TextOnly.args,
  icon: 'iconReact',
  children: null,
};
