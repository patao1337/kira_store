# Order Management System Documentation

## Overview

This document explains the order management system implemented for the KI•RA e-commerce platform. This system allows users to place orders, view their order history, and (in the future) allow administrators to manage these orders. It integrates with Supabase for backend services.

## Features

- Users can place orders from their cart.
- Users can view their past orders in their account section.
- Order details include products, quantities, prices at the time of purchase, shipping information, and order status.
- Secure handling of order data with Row Level Security.

## Technology Stack

- **Frontend**: Next.js, React
- **Backend**: Supabase (Database)
- **State Management**: Redux Toolkit (for cart, potentially for checkout state)

## Database Schema

The order management system uses the following table structures:

### Orders Table (`orders`)

| Column           | Type                     | Description                                                                 |
|------------------|--------------------------|-----------------------------------------------------------------------------|
| id               | UUID (Primary Key)       | Unique identifier for the order (default `gen_random_uuid()`)               |
| user_id          | UUID (Foreign Key)       | References `auth.users.id`. Links the order to a user. `ON DELETE CASCADE` |
| total_amount     | DECIMAL(10, 2)           | Total cost of the order. Not Null.                                          |
| status           | TEXT                     | Current status of the order (e.g., 'pending', 'processing', 'shipped', 'delivered', 'cancelled'). Not Null, default 'pending'. |
| shipping_address | JSONB                    | Shipping address details (e.g., name, street, city, postal_code, country). Not Null. |
| billing_address  | JSONB                    | Billing address details (can be null if same as shipping).                    |
| created_at       | TIMESTAMPTZ              | Timestamp of when the order was created (default `NOW()`).                   |
| updated_at       | TIMESTAMPTZ              | Timestamp of when the order was last updated (default `NOW()`, auto-updates). |

### Order Items Table (`order_items`)

| Column            | Type                     | Description                                                                    |
|-------------------|--------------------------|--------------------------------------------------------------------------------|
| id                | UUID (Primary Key)       | Unique identifier for the order item (default `gen_random_uuid()`).             |
| order_id          | UUID (Foreign Key)       | References `orders.id`. Links the item to an order. `ON DELETE CASCADE`.        |
| product_id        | INTEGER (Foreign Key)    | References `products.id`. Links to the specific product. Not Null.             |
| quantity          | INTEGER                  | Number of units of the product ordered. Not Null, default 1.                   |
| price_at_purchase | DECIMAL(10, 2)           | Price of the product at the time the order was placed. Not Null.               |
| created_at        | TIMESTAMPTZ              | Timestamp of when the order item was created (default `NOW()`).                  |

## Row Level Security (RLS)

- **Orders Table**:
    - Users can view their own orders.
    - Users can create orders for themselves.
    - Users can update their own orders only if the status is 'pending' (e.g., for cancellation).
- **Order Items Table**:
    - Users can view order items belonging to their own orders.
    - Users can create order items for their own orders.

## Checkout Flow (High-Level)

1.  **Cart Review**: User reviews items in their shopping cart.
2.  **Proceed to Checkout**: User initiates the checkout process.
3.  **Shipping Information**: User provides or confirms shipping address.
4.  **Billing Information**: User provides or confirms billing address (if different from shipping).
5.  **Payment**: User provides payment details (This will be a mock/simplified step for the diploma).
6.  **Order Confirmation**:
    *   An order is created in the `orders` table.
    *   Associated items are added to the `order_items` table.
    *   Cart is cleared.
    *   User is shown an order confirmation page/message.
7.  **Order History**: User can view their placed orders in their account section.

## API / Service Functions (Planned)

- `createOrder(userId, cartItems, shippingAddress, billingAddress, totalAmount)`: Creates a new order and associated order items.
- `getOrdersByUserId(userId)`: Fetches all orders for a specific user.
- `getOrderById(orderId, userId)`: Fetches a specific order for a user.

## Components (Planned)

- `CheckoutForm`: Handles shipping, billing, and payment (mock) information.
- `OrderSummary`: Displays items to be ordered and total cost.
- `OrderHistoryItem`: Component to display a single order in the user's account.
- `OrderDetailsPage`: A page to show the full details of a specific past order.

## Security Considerations

- RLS ensures users can only access their own order data.
- Sensitive payment information handling will be mocked for this project, but in a real-world scenario would require PCI compliance and integration with a secure payment gateway.

## Future Enhancements

- Admin panel for order management (view all orders, update status, etc.).
- Email notifications for order confirmation and status updates.
- Integration with a real payment gateway.
- Order tracking functionality.
- Handling returns and refunds. 