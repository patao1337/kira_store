import { supabase } from '@/lib/supabase';
import { Product } from '@/types/product.interface'; // Assuming you have this type

// Type Definitions

export interface Address {
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string; // Optional phone number
}

export interface OrderItemInput {
  // Accept either number or string for product_id to handle different formats
  product_id: number;
  quantity: number;
  price_at_purchase: number;
}

export interface CreateOrderPayload {
  userId: string;
  items: OrderItemInput[];
  totalAmount: number;
  shippingAddress: Address;
  billingAddress?: Address; // Optional, if different from shipping
  status?: string; // Optional, defaults to 'pending' in DB
}

export interface OrderItem extends OrderItemInput {
  id: string; // UUID
  order_id: string; // UUID
  created_at: string;
  product?: Product; // Populated for display
}

export interface Order {
  id: string; // UUID
  user_id: string;
  total_amount: number;
  status: string;
  shipping_address: Address;
  billing_address?: Address;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

/**
 * Creates a new order and its associated items in the database.
 * @param payload - The data required to create the order.
 * @returns The ID of the newly created order.
 * @throws Error if the order creation fails.
 */
export const createOrder = async (payload: CreateOrderPayload): Promise<string> => {
  const { userId, items, totalAmount, shippingAddress, billingAddress, status = 'pending' } = payload;

  // Validate that we have items to order
  if (!items || items.length === 0) {
    throw new Error('Cannot create an order without items.');
  }

  try {
    // 1. Create the order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        billing_address: billingAddress || shippingAddress, // Use shipping if billing is not provided
        status: status,
      })
      .select('id')
      .single();

    if (orderError || !orderData) {
      console.error('Error creating order:', orderError);
      throw new Error(orderError?.message || 'Failed to create order.');
    }

    const orderId = orderData.id;
    console.log(`Created order with ID: ${orderId}`);

    // 2. Create order items
    // Ensure product_id is a number as the database expects
    const orderItemsToInsert = items.map(item => {
      // Ensure product_id is a valid number
      const productId = typeof item.product_id === 'string' 
        ? parseInt(item.product_id, 10) 
        : item.product_id;
        
      // Log the product_id for debugging
      console.log(`Converting product_id for order: ${item.product_id} → ${productId}`);
      
      if (isNaN(productId)) {
        throw new Error(`Invalid product ID: ${item.product_id}`);
      }
      
      return {
        order_id: orderId,
        product_id: productId,
        quantity: item.quantity,
        price_at_purchase: item.price_at_purchase,
      };
    });

    console.log(`Inserting ${orderItemsToInsert.length} order items`);
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      console.error('Items that failed:', JSON.stringify(orderItemsToInsert));
      
      // For foreign key violations, provide more specific error message
      if (itemsError.code === '23503') { // PostgreSQL foreign key violation code
        throw new Error(`Product ID does not exist in database. Please check your cart items and try again.`);
      }
      
      throw new Error(itemsError.message || 'Failed to create order items.');
    }

    return orderId;
  } catch (error) {
    console.error('Order creation failed:', error);
    // Re-throw the error to be handled by the caller
    throw error;
  }
};

/**
 * Retrieves all orders for a specific user, along with their items and product details.
 * @param userId - The ID of the user whose orders are to be fetched.
 * @returns A promise that resolves to an array of orders.
 * @throws Error if fetching orders fails.
 */
export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  if (!userId) {
    throw new Error('User ID is required to fetch orders.');
  }

  const { data: ordersData, error: ordersError } = await supabase
    .from('orders')
    .select(`
      id,
      user_id,
      total_amount,
      status,
      shipping_address,
      billing_address,
      created_at,
      updated_at,
      order_items (
        id,
        order_id,
        product_id,
        quantity,
        price_at_purchase,
        created_at,
        products (
          id,
          title,
          price,
          src_url,
          category
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (ordersError) {
    console.error('Error fetching orders by user ID:', ordersError);
    throw new Error(ordersError.message || 'Failed to fetch orders.');
  }

  // Cast the fetched data to the Order[] type
  // The nested product data will be under order_items.products
  // We need to map this to order_items.product (singular)
  return (ordersData || []).map(order => ({
    ...order,
    order_items: order.order_items.map((item: any) => ({
      ...item,
      product: item.products, // Rename 'products' to 'product' to match OrderItem interface
      products: undefined, // Remove the old 'products' field
    })),
  })) as Order[];
};

/**
 * Retrieves a single order by its ID, along with its items and product details.
 * Ensures the order belongs to the authenticated user (via RLS).
 * @param orderId - The ID of the order to be fetched.
 * @returns A promise that resolves to the order, or null if not found/accessible.
 * @throws Error if fetching the order fails.
 */
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  if (!orderId) {
    throw new Error('Order ID is required to fetch an order.');
  }

  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .select(`
      id,
      user_id,
      total_amount,
      status,
      shipping_address,
      billing_address,
      created_at,
      updated_at,
      order_items (
        id,
        order_id,
        product_id,
        quantity,
        price_at_purchase,
        created_at,
        products (
          id,
          title,
          price,
          src_url,
          category
        )
      )
    `)
    .eq('id', orderId)
    .single(); // Use single() as we expect one order or null

  if (orderError) {
    // If error is due to RLS or not found (PGRST116: 0 rows), return null
    if (orderError.code === 'PGRST116') {
      console.warn(`Order with ID ${orderId} not found or access denied.`);
      return null;
    }
    console.error(`Error fetching order by ID (${orderId}):`, orderError);
    throw new Error(orderError.message || 'Failed to fetch order.');
  }

  if (!orderData) {
    return null;
  }

  // Cast the fetched data and map product details
  const order = {
    ...orderData,
    order_items: orderData.order_items.map((item: any) => ({
      ...item,
      product: item.products,
      products: undefined,
    })),
  } as Order;

  return order;
}; 