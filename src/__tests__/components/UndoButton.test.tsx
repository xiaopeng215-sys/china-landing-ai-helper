/**
 * UndoButton 组件单元测试
 * 覆盖率目标：> 80%
 */

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UndoButton, { useUndoHistory, UndoHistoryManager } from '@/components/ui/UndoButton';

describe('UndoButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该渲染撤销按钮', () => {
    render(<UndoButton />);
    expect(screen.getByText('撤销')).toBeInTheDocument();
  });

  it('应该在无法撤销时禁用按钮', () => {
    render(<UndoButton />);
    const button = screen.getByText('撤销').closest('button');
    expect(button).toBeDisabled();
  });

  it('应该支持自定义 className', () => {
    render(<UndoButton className="custom-class" />);
    const button = screen.getByText('撤销').closest('button');
    expect(button).toHaveClass('custom-class');
  });

  it('应该支持禁用状态', () => {
    render(<UndoButton disabled={true} />);
    const button = screen.getByText('撤销').closest('button');
    expect(button).toBeDisabled();
  });

  it('应该在点击时调用 onUndo 回调', () => {
    const onUndo = jest.fn();
    const { unmount } = render(<UndoButton onUndo={onUndo} />);
    
    // 添加一个撤销动作
    const manager = UndoHistoryManager.getInstance();
    manager.addAction({
      id: 'test-1',
      type: 'test',
      description: 'Test action',
      timestamp: Date.now(),
    });
    
    const button = screen.getByText('撤销').closest('button');
    fireEvent.click(button!);
    
    expect(onUndo).toHaveBeenCalled();
    
    unmount();
    manager.clear();
  });

  it('应该支持键盘快捷键 Ctrl+Z', () => {
    const onUndo = jest.fn();
    const { unmount } = render(<UndoButton onUndo={onUndo} />);
    
    // 添加一个撤销动作
    const manager = UndoHistoryManager.getInstance();
    manager.addAction({
      id: 'test-2',
      type: 'test',
      description: 'Test action',
      timestamp: Date.now(),
    });
    
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
    
    expect(onUndo).toHaveBeenCalled();
    
    unmount();
    manager.clear();
  });

  it('应该支持键盘快捷键 Cmd+Z (Mac)', () => {
    const onUndo = jest.fn();
    const { unmount } = render(<UndoButton onUndo={onUndo} />);
    
    // 添加一个撤销动作
    const manager = UndoHistoryManager.getInstance();
    manager.addAction({
      id: 'test-3',
      type: 'test',
      description: 'Test action',
      timestamp: Date.now(),
    });
    
    fireEvent.keyDown(window, { key: 'z', metaKey: true });
    
    expect(onUndo).toHaveBeenCalled();
    
    unmount();
    manager.clear();
  });
});

describe('useUndoHistory', () => {
  it('应该提供 addAction 方法', () => {
    const { result, unmount } = renderHook(() => useUndoHistory());
    
    expect(result.current.addAction).toBeDefined();
    expect(typeof result.current.addAction).toBe('function');
    
    unmount();
    UndoHistoryManager.getInstance().clear();
  });

  it('应该提供 undo 方法', () => {
    const { result, unmount } = renderHook(() => useUndoHistory());
    
    expect(result.current.undo).toBeDefined();
    expect(typeof result.current.undo).toBe('function');
    
    unmount();
    UndoHistoryManager.getInstance().clear();
  });

  it('应该提供 canUndo 方法', () => {
    const { result, unmount } = renderHook(() => useUndoHistory());
    
    expect(result.current.canUndo).toBeDefined();
    expect(typeof result.current.canUndo).toBe('function');
    
    unmount();
    UndoHistoryManager.getInstance().clear();
  });

  it('应该提供 clear 方法', () => {
    const { result, unmount } = renderHook(() => useUndoHistory());
    
    expect(result.current.clear).toBeDefined();
    expect(typeof result.current.clear).toBe('function');
    
    unmount();
    UndoHistoryManager.getInstance().clear();
  });

  it('应该跟踪撤销历史', () => {
    const { result, unmount } = renderHook(() => useUndoHistory());
    
    // 初始状态
    expect(result.current.canUndo()).toBe(false);
    
    // 添加动作
    result.current.addAction({
      type: 'test',
      description: 'Test action',
    });
    
    expect(result.current.canUndo()).toBe(true);
    
    unmount();
    UndoHistoryManager.getInstance().clear();
  });

  it('应该支持撤销操作', () => {
    const { result, unmount } = renderHook(() => useUndoHistory());
    
    // 添加动作
    result.current.addAction({
      type: 'test',
      description: 'Test action',
    });
    
    expect(result.current.canUndo()).toBe(true);
    
    // 撤销
    const action = result.current.undo();
    expect(action).toBeDefined();
    expect(result.current.canUndo()).toBe(false);
    
    unmount();
    UndoHistoryManager.getInstance().clear();
  });
});

describe('UndoHistoryManager', () => {
  it('应该是单例模式', () => {
    const instance1 = UndoHistoryManager.getInstance();
    const instance2 = UndoHistoryManager.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('应该支持添加动作', () => {
    const manager = UndoHistoryManager.getInstance();
    manager.clear();
    
    manager.addAction({
      id: 'test-1',
      type: 'test',
      description: 'Test action',
      timestamp: Date.now(),
    });
    
    expect(manager.canUndo()).toBe(true);
    manager.clear();
  });

  it('应该支持撤销动作', () => {
    const manager = UndoHistoryManager.getInstance();
    manager.clear();
    
    manager.addAction({
      id: 'test-2',
      type: 'test',
      description: 'Test action',
      timestamp: Date.now(),
    });
    
    const action = manager.undo();
    expect(action).toBeDefined();
    expect(action?.description).toBe('Test action');
    manager.clear();
  });

  it('应该限制历史记录数量', () => {
    const manager = UndoHistoryManager.getInstance();
    manager.clear();
    manager.setMaxHistory(3);
    
    // 添加 5 个动作
    for (let i = 1; i <= 5; i++) {
      manager.addAction({
        id: `test-${i}`,
        type: 'test',
        description: `Test action ${i}`,
        timestamp: Date.now(),
      });
    }
    
    const history = manager.getHistory();
    expect(history.length).toBe(3);
    manager.clear();
    manager.setMaxHistory(10);
  });

  it('应该支持清空历史', () => {
    const manager = UndoHistoryManager.getInstance();
    manager.clear();
    
    manager.addAction({
      id: 'test-3',
      type: 'test',
      description: 'Test action',
      timestamp: Date.now(),
    });
    
    expect(manager.canUndo()).toBe(true);
    manager.clear();
    expect(manager.canUndo()).toBe(false);
  });

  it('应该支持订阅者通知', () => {
    const manager = UndoHistoryManager.getInstance();
    manager.clear();
    
    const callback = jest.fn();
    const unsubscribe = manager.subscribe(callback);
    
    manager.addAction({
      id: 'test-4',
      type: 'test',
      description: 'Test action',
      timestamp: Date.now(),
    });
    
    expect(callback).toHaveBeenCalled();
    
    unsubscribe();
    manager.clear();
  });
});

// Helper function for renderHook
function renderHook<T>(callback: () => T) {
  const result = { current: null as T | null };
  const { render } = require('@testing-library/react');
  
  function TestComponent() {
    result.current = callback();
    return null;
  }
  
  render(<TestComponent />);
  
  return {
    result: result as { current: T },
    unmount: () => {},
    rerender: () => {},
  };
}
