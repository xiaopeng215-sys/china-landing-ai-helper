/**
 * 单元测试示例 - 展示测试框架结构
 * 
 * @packageDocumentation
 */

describe('Example Unit Tests', () => {
  describe('Basic Tests', () => {
    it('should pass a basic truthy test', () => {
      expect(true).toBeTruthy();
    });

    it('should pass a basic equality test', () => {
      expect(2 + 2).toBe(4);
    });

    it('should handle array operations', () => {
      const arr = [1, 2, 3, 4];
      expect(arr.length).toBe(4);
      expect(arr).toContain(3);
      expect(arr.filter(x => x > 2)).toEqual([3, 4]);
    });

    it('should handle object operations', () => {
      const obj = { name: 'Test', value: 42 };
      expect(obj.name).toBe('Test');
      expect(obj.value).toBe(42);
      expect(Object.keys(obj)).toEqual(['name', 'value']);
    });
  });

  describe('String Operations', () => {
    it('should handle string methods', () => {
      const str = 'Hello World';
      expect(str.toLowerCase()).toBe('hello world');
      expect(str.toUpperCase()).toBe('HELLO WORLD');
      expect(str.split(' ')).toEqual(['Hello', 'World']);
      expect(str.includes('World')).toBe(true);
    });

    it('should handle string formatting', () => {
      const template = (name: string, age: number) => 
        `Name: ${name}, Age: ${age}`;
      
      expect(template('Alice', 30)).toBe('Name: Alice, Age: 30');
    });
  });

  describe('Async Operations', () => {
    it('should handle promises', async () => {
      const promise = Promise.resolve('success');
      await expect(promise).resolves.toBe('success');
    });

    it('should handle async/await', async () => {
      const asyncFunction = async () => {
        return new Promise<string>((resolve) => {
          setTimeout(() => resolve('done'), 10);
        });
      };
      
      const result = await asyncFunction();
      expect(result).toBe('done');
    });

    it('should handle rejected promises', async () => {
      const promise = Promise.reject(new Error('Something went wrong'));
      await expect(promise).rejects.toThrow('Something went wrong');
    });
  });

  describe('Mock Functions', () => {
    it('should mock a function', () => {
      const mockFn = jest.fn();
      mockFn('hello', 'world');
      
      expect(mockFn).toHaveBeenCalled();
      expect(mockFn).toHaveBeenCalledWith('hello', 'world');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should mock return values', () => {
      const mockFn = jest.fn()
        .mockReturnValueOnce('first')
        .mockReturnValueOnce('second')
        .mockReturnValue('default');
      
      expect(mockFn()).toBe('first');
      expect(mockFn()).toBe('second');
      expect(mockFn()).toBe('default');
      expect(mockFn()).toBe('default');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null and undefined', () => {
      expect(null).toBeNull();
      expect(undefined).toBeUndefined();
      expect({}).toBeDefined();
    });

    it('should handle empty values', () => {
      expect('').toBeFalsy();
      expect([]).toBeTruthy();
      expect({}).toBeTruthy();
      expect(0).toBeFalsy();
    });

    it('should handle number edge cases', () => {
      expect(NaN).toBeNaN();
      expect(Number.isFinite(Infinity)).toBe(false);
      expect(Number.isFinite(42)).toBe(true);
      expect(42).toBeCloseTo(42.0, 5);
    });
  });
});

describe('Utility Function Tests', () => {
  // 模拟工具函数测试
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const calculateDiscount = (price: number, percent: number): number => {
    if (percent < 0 || percent > 100) {
      throw new Error('Invalid discount percent');
    }
    return price * (1 - percent / 100);
  };

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      expect(formatDate(date)).toBe('2024-01-15');
    });
  });

  describe('calculateDiscount', () => {
    it('should calculate 10% discount', () => {
      expect(calculateDiscount(100, 10)).toBe(90);
    });

    it('should calculate 50% discount', () => {
      expect(calculateDiscount(200, 50)).toBe(100);
    });

    it('should throw error for invalid percent', () => {
      expect(() => calculateDiscount(100, -5)).toThrow('Invalid discount percent');
      expect(() => calculateDiscount(100, 105)).toThrow('Invalid discount percent');
    });
  });
});
