import { describe, expect, it } from 'vitest';
import { mockCategories, mockMenuItems, mockTables } from '../src/lib/mockData';

describe('backend contract seed data', () => {
  it('includes the required default Thai categories', () => {
    expect(mockCategories.map((category) => category.name_th)).toEqual([
      'เครื่องดื่ม',
      'อาหารจานหลัก',
      'ของทานเล่น',
      'โรตี',
      'ขนมปัง',
      'ยำ',
    ]);
  });

  it('has active demo tables and available menu items for local fallback', () => {
    expect(mockTables.every((table) => table.is_active)).toBe(true);
    expect(mockMenuItems.length).toBeGreaterThan(0);
    expect(mockMenuItems.every((item) => item.is_available)).toBe(true);
  });
});
