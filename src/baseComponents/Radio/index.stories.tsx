import { ComponentMeta } from '@storybook/react-native';
import Radio from '.';
import { getStoryComponent } from '~/storybook';

export default {
  title: 'base/Radio',
  component: Radio,
  argTypes: {
    disabled: {
      control: {
        type: 'select',
      },
      options: ['disabled', 'disabled-auto-selected'],
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['small', 'medium'],
    },
  },
} as ComponentMeta<typeof Radio>;

const StoryComponent = getStoryComponent(Radio);

export const NoLabel = StoryComponent.bind({});
NoLabel.args = {
  isChecked: false,
  onPress: (
    isChecked: boolean,
  ) => { alert(`Change checked: ${isChecked}`) },
}

export const WithLabel = StoryComponent.bind({});
WithLabel.args = {
  ...NoLabel,
  label: 'Label of radio button',
}
