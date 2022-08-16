/* eslint-disable no-alert */
import CheckBox from '.';
import { ComponentMeta, getStoryComponent } from '~/storybook';

export default {
  title: 'base/CheckBox',
  component: CheckBox,
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
} as ComponentMeta<typeof CheckBox>;

const StoryComponent = getStoryComponent(CheckBox);

export const NoLabel = StoryComponent.bind({});
NoLabel.args = {
  isChecked: true,
  onPress: () => { alert('onPress') },
}

export const WithLabel = StoryComponent.bind({});
WithLabel.args = {
  ...NoLabel,
  label: 'Label of checkbox',
}
