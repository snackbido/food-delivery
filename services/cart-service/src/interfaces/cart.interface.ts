export interface CartItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  notes?: string;
  subtotal: number;
}

export interface Cart {
  user_id: string;
  restaurant_id: string;
  items: CartItem[];
  total_items: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
}
