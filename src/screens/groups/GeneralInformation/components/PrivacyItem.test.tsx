import React from 'react';
import { GroupPrivacyType } from '~/constants/privacyTypes';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import PrivacyItem from './PrivacyItem';
import { languages } from '~/localization';

describe('PrivacyItem component', () => {
  it('should show checked icon when isSelected = true', () => {
    const onSelectPrivacy = jest.fn();
    const type = 'group';
    const selectedPrivacy = GroupPrivacyType.OPEN;

    const rendered = renderWithRedux(<PrivacyItem
      value={GroupPrivacyType.OPEN}
      icon="iconOpen"
      title="settings:title_open"
      subtitle={`settings:title_open_subtitle_${type}`}
      selectedPrivacy={selectedPrivacy}
      onPress={onSelectPrivacy}
    />);
    const titleComp = rendered.getByTestId('privacty_item.title');
    expect(titleComp.children?.[0]).toEqual(languages.en.settings.title_open);

    const subTitleComp = rendered.getByTestId('privacty_item.subtitle');
    expect(subTitleComp.children?.[0]).toEqual(languages.en.settings.title_open_subtitle_group);

    const iconChecked = rendered.getByTestId('privacty_item.checked');
    expect(iconChecked).toBeDefined();
  });

  it('should not show checked icon when isSelected = false', () => {
    const onSelectPrivacy = jest.fn();
    const type = 'group';
    const selectedPrivacy = GroupPrivacyType.CLOSED;

    const rendered = renderWithRedux(<PrivacyItem
      value={GroupPrivacyType.OPEN}
      icon="iconOpen"
      title="settings:title_open"
      subtitle={`settings:title_open_subtitle_${type}`}
      selectedPrivacy={selectedPrivacy}
      onPress={onSelectPrivacy}
    />);
    const titleComp = rendered.getByTestId('privacty_item.title');
    expect(titleComp).toBeDefined();
    expect(titleComp.children?.[0]).toEqual(languages.en.settings.title_open);

    const subTitleComp = rendered.getByTestId('privacty_item.subtitle');
    expect(subTitleComp).toBeDefined();
    expect(subTitleComp.children?.[0]).toEqual(languages.en.settings.title_open_subtitle_group);

    const iconChecked = rendered.queryByTestId('privacty_item.checked');
    expect(iconChecked).toBeNull();
  });

  it('should call onSelectPrivacy when click item', () => {
    const onSelectPrivacy = jest.fn();
    const type = 'group';
    const selectedPrivacy = GroupPrivacyType.OPEN;

    const rendered = renderWithRedux(<PrivacyItem
      value={GroupPrivacyType.OPEN}
      icon="iconOpen"
      title="settings:title_open"
      subtitle={`settings:title_open_subtitle_${type}`}
      selectedPrivacy={selectedPrivacy}
      onPress={onSelectPrivacy}
    />);
    const itemComp = rendered.getByTestId('privacty_item.view');
    expect(itemComp).toBeDefined();

    fireEvent.press(itemComp);
    expect(onSelectPrivacy).toBeCalled();
  });
});
