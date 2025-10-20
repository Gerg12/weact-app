/**
 * Checkout Types
 * 
 * Type definitions for the checkout process
 */

/**
 * Checkout Item
 * Represents a single item in the checkout request
 */
export interface CheckoutItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

/**
 * Customer Information
 * Required customer details for checkout
 */
export interface CustomerInfo {
  email: string;
  name: string;
  phone?: string;
  // Shipping address (for future implementation)
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

/**
 * Checkout Request
 * Data sent to /api/checkout endpoint
 */
export interface CheckoutRequest {
  items: CheckoutItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  customer: CustomerInfo;
  paymentToken: string; // Stripe payment token from client-side tokenization
}

/**
 * Checkout Response
 * Response from /api/checkout endpoint
 */
export interface CheckoutResponse {
  success: boolean;
  message: string;
  orderId?: string;
  transactionId?: string;
  error?: string;
}

/**
 * Payment Method
 * For future Stripe Elements integration
 */
export interface PaymentMethod {
  type: 'card' | 'paypal' | 'applepay' | 'googlepay';
  token?: string;
  paymentMethodId?: string;
}

