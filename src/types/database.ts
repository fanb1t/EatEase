export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type OrderStatus = 'new' | 'accepted' | 'preparing' | 'ready' | 'served' | 'cancelled';

export type Database = {
  public: {
    Tables: {
      tables: {
        Row: {
          id: string;
          table_number: string;
          slug: string;
          display_name: string | null;
          seats: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          table_number: string;
          slug: string;
          display_name?: string | null;
          seats?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['tables']['Insert']>;
      };
      menu_categories: {
        Row: {
          id: string;
          slug: string;
          name_th: string;
          name_en: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name_th: string;
          name_en: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['menu_categories']['Insert']>;
      };
      menu_items: {
        Row: {
          id: string;
          category_id: string;
          slug: string;
          name_th: string;
          name_en: string;
          description_th: string | null;
          description_en: string | null;
          price: number;
          image_url: string | null;
          thumbnail_url: string | null;
          is_available: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          slug: string;
          name_th: string;
          name_en: string;
          description_th?: string | null;
          description_en?: string | null;
          price: number;
          image_url?: string | null;
          thumbnail_url?: string | null;
          is_available?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['menu_items']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          table_id: string;
          table_number: string;
          customer_name: string | null;
          status: OrderStatus;
          notes: string | null;
          subtotal: number;
          total: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          table_id: string;
          table_number: string;
          customer_name?: string | null;
          status?: OrderStatus;
          notes?: string | null;
          subtotal?: number;
          total?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string | null;
          item_name_th: string;
          item_name_en: string;
          quantity: number;
          unit_price: number;
          line_total: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_item_id?: string | null;
          item_name_th: string;
          item_name_en: string;
          quantity: number;
          unit_price: number;
          line_total: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      order_status: OrderStatus;
    };
  };
};
