import { act } from '@testing-library/react-hooks';
import { renderHook } from '~/test/testUtils';
import { dimension as actualDimension } from '~/theme';
import { deviceDimensions } from '~/theme/dimension';
import useEmojiPickerStore from '.';

describe('useEmojiPickerStore hook', () => {
  let dimension;

  beforeEach(() => {
    jest.clearAllMocks();
    dimension = actualDimension;
    const { result } = renderHook(() => useEmojiPickerStore((state) => state));
    act(() => { result.current.actions.buildEmojis(); });
  });

  it('should buildEmojis', () => {
    const { result } = renderHook(() => useEmojiPickerStore());

    expect(result.current.data.length).toBeGreaterThan(0);
    expect(result.current.filteredData).toBeNull();
    expect(result.current.recentlyData.length).toEqual(0);
    expect(result.current.currentSectionIndex).toEqual(0);
    expect(result.current.fuse).not.toBeNull();
    expect(result.current.emojiSectionIndexByOffset.length).toBeGreaterThan(0);
  });

  it('should search emoji', () => {
    const { result } = renderHook(() => useEmojiPickerStore());
    result.current.actions.search('smile');
    expect(result.current.filteredData.length).toBeGreaterThan(0);

    result.current.actions.search('22334455');
    expect(result.current.filteredData.length).toEqual(0);
  });

  it('should addToRecently', () => {
    const { result } = renderHook(() => useEmojiPickerStore());
    dimension.deviceWidth = deviceDimensions.phone;

    result.current.actions.addToRecently('smile');
    expect(result.current.recentlyData).toContain('smile');

    result.current.actions.addToRecently('grinning');
    expect(result.current.recentlyData).toContain('grinning');

    result.current.actions.addToRecently('laughing');
    expect(result.current.recentlyData).toContain('laughing');

    result.current.actions.addToRecently('smiley');
    expect(result.current.recentlyData).toContain('smiley');

    result.current.actions.addToRecently('grin');
    expect(result.current.recentlyData).toContain('grin');

    result.current.actions.addToRecently('satisfied');
    expect(result.current.recentlyData).toContain('satisfied');

    result.current.actions.addToRecently('rolling_on_the_floor_laughing');
    expect(result.current.recentlyData).toContain('rolling_on_the_floor_laughing');
    expect(result.current.recentlyData).not.toContain('smile');
  });

  it('should setCurrentSectionIndex', () => {
    const { result } = renderHook(() => useEmojiPickerStore());
    result.current.actions.setCurrentSectionIndex(2);

    expect(result.current.currentSectionIndex).toEqual(2);
  });

  it('should resetData', () => {
    const { result } = renderHook(() => useEmojiPickerStore());
    result.current.actions.resetData();

    expect(result.current.filteredData).toBeNull();
    expect(result.current.currentSectionIndex).toEqual(0);
  });

  it('should reset store', () => {
    const { result } = renderHook(() => useEmojiPickerStore());
    result.current.reset();

    expect(result.current.data.length).toEqual(0);
    expect(result.current.emojiSectionIndexByOffset.length).toEqual(0);
    expect(result.current.filteredData.length).toBeNull();
    expect(result.current.recentlyData.length).toEqual(0);
    expect(result.current.currentSectionIndex).toEqual(0);
    expect(result.current.fuse).toBeNull();
  });
});
