/* eslint-disable no-alert */
import Tab from '.';
import { ComponentMeta, getStoryComponent } from '~/storybook';

export default {
  title: 'base/Tab',
  component: Tab,
  argTypes: {
    type: {
      control: {
        type: 'select',
      },
      options: ['pill', 'normal'],
    },
    'buttonProps.type': {
      control: {
        type: 'select',
      },
      options: ['primary', 'secondary', 'neutral'],
    },
  },
} as ComponentMeta<typeof Tab>;

const StoryComponent = getStoryComponent(Tab);

export const Default = StoryComponent.bind({});
Default.args = {
  data: [{ id: '1', text: 'Tab 1' }, { id: '2', text: 'Tab 2' }],
  type: 'normal',
  activeIndex: 1,
  buttonProps: { type: 'primary' },
  onPressTab: (
    item: any, index: number,
  ) => { alert(`Change checked: ${item.text}`) },
}
