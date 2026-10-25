import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  jest.useFakeTimers();

  test('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 300));
    expect(result.current).toBe('test');
  });

  test('should debounce value changes with specified delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    expect(result.current).toBe('initial');

    act(() => {
      rerender({ value: 'updated', delay: 300 });
    });

    expect(result.current).toBe('initial'); // Not updated yet

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('updated'); // Updated after delay
  });

  test('should cancel previous timer when value changes before delay completes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 300 } }
    );

    act(() => {
      rerender({ value: 'second', delay: 300 });
      jest.advanceTimersByTime(150);
      rerender({ value: 'third', delay: 300 });
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('third'); // Only last value applied
  });

  jest.useRealTimers();
});
