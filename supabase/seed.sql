insert into public.tables (table_number, slug, display_name, seats)
values
  ('1', 'table-1', 'Table 1', 4),
  ('2', 'table-2', 'Table 2', 4),
  ('3', 'table-3', 'Table 3', 6),
  ('4', 'table-4', 'Table 4', 2)
on conflict (slug) do update
set table_number = excluded.table_number,
    display_name = excluded.display_name,
    seats = excluded.seats,
    is_active = true;

insert into public.menu_categories (slug, name_th, name_en, sort_order)
values
  ('drinks', 'เครื่องดื่ม', 'Drinks', 10),
  ('mains', 'อาหารจานหลัก', 'Main dishes', 20),
  ('snacks', 'ของทานเล่น', 'Snacks', 30),
  ('roti', 'โรตี', 'Roti', 40),
  ('bread', 'ขนมปัง', 'Bread', 50),
  ('spicy-salads', 'ยำ', 'Spicy salads', 60)
on conflict (slug) do update
set name_th = excluded.name_th,
    name_en = excluded.name_en,
    sort_order = excluded.sort_order,
    is_active = true;

insert into public.menu_items (
  category_id,
  slug,
  name_th,
  name_en,
  description_th,
  description_en,
  price,
  sort_order
)
select c.id, item.slug, item.name_th, item.name_en, item.description_th, item.description_en, item.price, item.sort_order
from (
  values
    ('drinks', 'thai-iced-tea', 'ชาไทยเย็น', 'Thai iced tea', 'ชาไทยหอมมัน', 'Sweet creamy Thai tea', 45.00, 10),
    ('drinks', 'lime-soda', 'มะนาวโซดา', 'Lime soda', 'เปรี้ยวซ่าสดชื่น', 'Fresh lime with soda', 40.00, 20),
    ('mains', 'chicken-rice', 'ข้าวมันไก่', 'Chicken rice', 'ข้าวมันไก่พร้อมน้ำจิ้ม', 'Chicken rice with sauce', 65.00, 10),
    ('mains', 'basil-pork-rice', 'ข้าวกะเพราหมู', 'Basil pork rice', 'ผัดกะเพราหมูราดข้าว', 'Stir-fried basil pork over rice', 70.00, 20),
    ('snacks', 'fried-chicken-wings', 'ปีกไก่ทอด', 'Fried chicken wings', 'ปีกไก่ทอดกรอบ', 'Crispy fried wings', 85.00, 10),
    ('roti', 'roti-condensed-milk', 'โรตีนม', 'Roti with condensed milk', 'โรตีกรอบราดนม', 'Crispy roti with condensed milk', 35.00, 10),
    ('bread', 'toast-butter-sugar', 'ปังปิ้งเนยน้ำตาล', 'Butter sugar toast', 'ขนมปังปิ้งหอมเนย', 'Toast with butter and sugar', 30.00, 10),
    ('spicy-salads', 'yum-mama', 'ยำมาม่า', 'Spicy instant noodle salad', 'ยำมาม่ารสจัด', 'Spicy noodle salad', 75.00, 10)
) as item(category_slug, slug, name_th, name_en, description_th, description_en, price, sort_order)
join public.menu_categories c on c.slug = item.category_slug
on conflict (slug) do update
set category_id = excluded.category_id,
    name_th = excluded.name_th,
    name_en = excluded.name_en,
    description_th = excluded.description_th,
    description_en = excluded.description_en,
    price = excluded.price,
    sort_order = excluded.sort_order,
    is_available = true;
