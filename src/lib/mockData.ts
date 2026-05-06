import type { DiningTable, MenuCategory, MenuItem, OrderWithItems } from '../types/eatease';

const now = new Date().toISOString();

export const mockTables: DiningTable[] = [
  { id: 'table-1-id', table_number: '1', slug: 'table-1', display_name: 'Table 1', seats: 4, is_active: true, created_at: now, updated_at: now },
  { id: 'table-2-id', table_number: '2', slug: 'table-2', display_name: 'Table 2', seats: 4, is_active: true, created_at: now, updated_at: now },
  { id: 'table-3-id', table_number: '3', slug: 'table-3', display_name: 'Table 3', seats: 6, is_active: true, created_at: now, updated_at: now },
];

export const mockCategories: MenuCategory[] = [
  { id: 'category-drinks', slug: 'drinks', name_th: 'เครื่องดื่ม', name_en: 'Drinks', sort_order: 10, is_active: true, created_at: now, updated_at: now },
  { id: 'category-mains', slug: 'mains', name_th: 'อาหารจานหลัก', name_en: 'Main dishes', sort_order: 20, is_active: true, created_at: now, updated_at: now },
  { id: 'category-snacks', slug: 'snacks', name_th: 'ของทานเล่น', name_en: 'Snacks', sort_order: 30, is_active: true, created_at: now, updated_at: now },
  { id: 'category-roti', slug: 'roti', name_th: 'โรตี', name_en: 'Roti', sort_order: 40, is_active: true, created_at: now, updated_at: now },
  { id: 'category-bread', slug: 'bread', name_th: 'ขนมปัง', name_en: 'Bread', sort_order: 50, is_active: true, created_at: now, updated_at: now },
  { id: 'category-spicy-salads', slug: 'spicy-salads', name_th: 'ยำ', name_en: 'Spicy salads', sort_order: 60, is_active: true, created_at: now, updated_at: now },
];

export const mockMenuItems: MenuItem[] = [
  { id: 'item-thai-iced-tea', category_id: 'category-drinks', slug: 'thai-iced-tea', name_th: 'ชาไทยเย็น', name_en: 'Thai iced tea', description_th: 'ชาไทยหอมมัน', description_en: 'Sweet creamy Thai tea', price: 45, image_url: null, thumbnail_url: null, is_available: true, sort_order: 10, created_at: now, updated_at: now },
  { id: 'item-lime-soda', category_id: 'category-drinks', slug: 'lime-soda', name_th: 'มะนาวโซดา', name_en: 'Lime soda', description_th: 'เปรี้ยวซ่าสดชื่น', description_en: 'Fresh lime with soda', price: 40, image_url: null, thumbnail_url: null, is_available: true, sort_order: 20, created_at: now, updated_at: now },
  { id: 'item-chicken-rice', category_id: 'category-mains', slug: 'chicken-rice', name_th: 'ข้าวมันไก่', name_en: 'Chicken rice', description_th: 'ข้าวมันไก่พร้อมน้ำจิ้ม', description_en: 'Chicken rice with sauce', price: 65, image_url: null, thumbnail_url: null, is_available: true, sort_order: 10, created_at: now, updated_at: now },
  { id: 'item-basil-pork-rice', category_id: 'category-mains', slug: 'basil-pork-rice', name_th: 'ข้าวกะเพราหมู', name_en: 'Basil pork rice', description_th: 'ผัดกะเพราหมูราดข้าว', description_en: 'Stir-fried basil pork over rice', price: 70, image_url: null, thumbnail_url: null, is_available: true, sort_order: 20, created_at: now, updated_at: now },
  { id: 'item-fried-chicken-wings', category_id: 'category-snacks', slug: 'fried-chicken-wings', name_th: 'ปีกไก่ทอด', name_en: 'Fried chicken wings', description_th: 'ปีกไก่ทอดกรอบ', description_en: 'Crispy fried wings', price: 85, image_url: null, thumbnail_url: null, is_available: true, sort_order: 10, created_at: now, updated_at: now },
  { id: 'item-roti-condensed-milk', category_id: 'category-roti', slug: 'roti-condensed-milk', name_th: 'โรตีนม', name_en: 'Roti with condensed milk', description_th: 'โรตีกรอบราดนม', description_en: 'Crispy roti with condensed milk', price: 35, image_url: null, thumbnail_url: null, is_available: true, sort_order: 10, created_at: now, updated_at: now },
  { id: 'item-toast-butter-sugar', category_id: 'category-bread', slug: 'toast-butter-sugar', name_th: 'ปังปิ้งเนยน้ำตาล', name_en: 'Butter sugar toast', description_th: 'ขนมปังปิ้งหอมเนย', description_en: 'Toast with butter and sugar', price: 30, image_url: null, thumbnail_url: null, is_available: true, sort_order: 10, created_at: now, updated_at: now },
  { id: 'item-yum-mama', category_id: 'category-spicy-salads', slug: 'yum-mama', name_th: 'ยำมาม่า', name_en: 'Spicy instant noodle salad', description_th: 'ยำมาม่ารสจัด', description_en: 'Spicy noodle salad', price: 75, image_url: null, thumbnail_url: null, is_available: true, sort_order: 10, created_at: now, updated_at: now },
];

export const mockOrders: OrderWithItems[] = [];
