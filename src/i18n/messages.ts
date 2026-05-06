import type { Locale, OrderStatus } from "../types";

type MessageKey =
  | "appName"
  | "customerSubtitle"
  | "table"
  | "cart"
  | "emptyCart"
  | "add"
  | "subtotal"
  | "submitOrder"
  | "orderPlaced"
  | "yourOrder"
  | "kitchen"
  | "admin"
  | "all"
  | "available"
  | "unavailable"
  | "recommended"
  | "customerNote"
  | "save"
  | "newCategory"
  | "newItem"
  | "tables"
  | "menu"
  | "orders"
  | "noOrders"
  | "imageUrl"
  | "price"
  | "status";

export const messages: Record<Locale, Record<MessageKey, string>> = {
  th: {
    appName: "EatEase",
    customerSubtitle: "สั่งอาหารจากโต๊ะของคุณได้ทันที",
    table: "โต๊ะ",
    cart: "ตะกร้า",
    emptyCart: "ยังไม่มีรายการในตะกร้า",
    add: "เพิ่ม",
    subtotal: "รวม",
    submitOrder: "ส่งออเดอร์",
    orderPlaced: "ส่งออเดอร์แล้ว",
    yourOrder: "ออเดอร์ของคุณ",
    kitchen: "ครัว",
    admin: "แอดมิน",
    all: "ทั้งหมด",
    available: "พร้อมขาย",
    unavailable: "งดขาย",
    recommended: "แนะนำ",
    customerNote: "หมายเหตุถึงร้าน",
    save: "บันทึก",
    newCategory: "หมวดหมู่ใหม่",
    newItem: "เมนูใหม่",
    tables: "โต๊ะ",
    menu: "เมนู",
    orders: "ออเดอร์",
    noOrders: "ยังไม่มีออเดอร์",
    imageUrl: "ลิงก์รูปภาพ",
    price: "ราคา",
    status: "สถานะ",
  },
  en: {
    appName: "EatEase",
    customerSubtitle: "Order from your table in a few taps",
    table: "Table",
    cart: "Cart",
    emptyCart: "Your cart is empty",
    add: "Add",
    subtotal: "Subtotal",
    submitOrder: "Submit order",
    orderPlaced: "Order placed",
    yourOrder: "Your order",
    kitchen: "Kitchen",
    admin: "Admin",
    all: "All",
    available: "Available",
    unavailable: "Unavailable",
    recommended: "Recommended",
    customerNote: "Note for the restaurant",
    save: "Save",
    newCategory: "New category",
    newItem: "New item",
    tables: "Tables",
    menu: "Menu",
    orders: "Orders",
    noOrders: "No orders yet",
    imageUrl: "Image URL",
    price: "Price",
    status: "Status",
  },
};

export const statusLabels: Record<Locale, Record<OrderStatus, string>> = {
  th: {
    new: "ใหม่",
    accepted: "รับออเดอร์",
    preparing: "กำลังทำ",
    served: "เสิร์ฟแล้ว",
    cancelled: "ยกเลิก",
  },
  en: {
    new: "New",
    accepted: "Accepted",
    preparing: "Preparing",
    served: "Served",
    cancelled: "Cancelled",
  },
};

export function t(locale: Locale, key: MessageKey) {
  return messages[locale][key];
}
