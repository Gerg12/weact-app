import { NextRequest, NextResponse } from 'next/server';

/**
 * Checkout API Route
 * 
 * SECURE SERVER-SIDE ONLY ENDPOINT
 * This route runs entirely in a Node.js server environment (not in the browser).
 * It handles payment processing by communicating with external payment gateways.
 * 
 * Security Features:
 * - Server-side only execution (client cannot see environment variables)
 * - Never exposes API keys to the client
 * - Validates all incoming data
 * - Uses secure payment tokens instead of raw card data
 * - CORS protection via Next.js API routes
 */

/**
 * Payment Request Interface
 * Defines the structure of data sent from the client
 */
interface CheckoutRequest {
  // Cart data
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  
  // Order totals
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  
  // Customer information
  customer: {
    email: string;
    name: string;
    // Additional customer fields can be added here
  };
  
  // IMPORTANT: Payment token from Stripe.js (NOT raw card details)
  // This token is created on the client-side using Stripe.js
  // and represents a one-time-use secure payment method
  paymentToken: string;
}

/**
 * Payment Response Interface
 * Defines the structure of successful/failed responses
 */
interface CheckoutResponse {
  success: boolean;
  message: string;
  orderId?: string;
  transactionId?: string;
  error?: string;
}

/**
 * POST /api/checkout
 * 
 * Processes a secure payment transaction
 * 
 * PAYMENT FLOW:
 * 1. Client collects card details in Stripe Elements (secure iframe)
 * 2. Stripe.js creates a payment token directly with Stripe servers
 * 3. Client sends cart data + payment token to this API route
 * 4. This server-side route uses the token to charge the card via Stripe API
 * 5. Server returns success/failure response
 * 
 * WHY THIS IS SECURE:
 * - Raw card details NEVER touch our servers
 * - Payment token is single-use only
 * - Stripe API keys stored in environment variables (server-side only)
 * - Client cannot access or modify API keys
 */
export async function POST(request: NextRequest) {
  try {
    // ==========================================
    // STEP 1: Parse and Validate Request Data
    // ==========================================
    const body: CheckoutRequest = await request.json();
    
    // Validate required fields
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }
    
    if (!body.paymentToken) {
      return NextResponse.json(
        { success: false, error: 'Payment token is required' },
        { status: 400 }
      );
    }
    
    if (!body.customer?.email) {
      return NextResponse.json(
        { success: false, error: 'Customer email is required' },
        { status: 400 }
      );
    }
    
    // Validate total amount (prevent price manipulation)
    const calculatedTotal = body.subtotal + body.tax + body.shipping;
    if (Math.abs(calculatedTotal - body.total) > 0.01) {
      return NextResponse.json(
        { success: false, error: 'Invalid order total' },
        { status: 400 }
      );
    }
    
    console.log('Processing checkout for:', {
      email: body.customer.email,
      total: body.total,
      itemCount: body.items.length,
    });
    
    // ==========================================
    // STEP 2: CLIENT-SIDE TOKENIZATION
    // ==========================================
    /**
     * IMPORTANT: Payment Token Security
     * 
     * The payment token (body.paymentToken) was created on the client side using:
     * 
     * ```javascript
     * // Client-side code (in browser):
     * const stripe = await loadStripe(PUBLISHABLE_KEY); // Safe to expose
     * const { token, error } = await stripe.createToken(cardElement);
     * 
     * // Send only the token to server, NOT the card details
     * fetch('/api/checkout', {
     *   method: 'POST',
     *   body: JSON.stringify({ paymentToken: token.id, ... })
     * });
     * ```
     * 
     * How this works:
     * 1. User enters card details into Stripe Elements (secure iframe)
     * 2. Stripe.js sends card data directly to Stripe servers (not our server)
     * 3. Stripe returns a single-use token (tok_xxxxxxxxxxxx)
     * 4. Our client sends ONLY the token to this API route
     * 5. This route uses the token to complete the charge
     * 
     * Benefits:
     * - Card data never touches our servers (PCI compliance simplified)
     * - Token is single-use only (cannot be reused if intercepted)
     * - Stripe handles all card data security
     */
    
    const paymentToken = body.paymentToken;
    
    // ==========================================
    // STEP 3: SERVER-SIDE PAYMENT PROCESSING
    // ==========================================
    /**
     * SECURE PAYMENT GATEWAY INTEGRATION
     * 
     * This section communicates with Stripe using SECRET API keys
     * that are ONLY available on the server (never sent to client).
     * 
     * Environment Variables Required:
     * - STRIPE_SECRET_KEY: Your secret API key from Stripe dashboard
     * 
     * Example .env.local file:
     * ```
     * STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
     * STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
     * ```
     * 
     * NEVER commit these keys to version control!
     * Add .env.local to .gitignore
     */
    
    // Get Stripe secret key from environment variables
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY not configured in environment variables');
      return NextResponse.json(
        { success: false, error: 'Payment system not configured' },
        { status: 500 }
      );
    }
    
    // ==========================================
    // PLACEHOLDER: Stripe Payment Processing
    // ==========================================
    /**
     * TODO: Implement actual Stripe charge
     * 
     * When ready to implement, install Stripe SDK:
     * ```bash
     * npm install stripe
     * ```
     * 
     * Then uncomment and configure this code:
     * 
     * ```typescript
     * import Stripe from 'stripe';
     * 
     * const stripe = new Stripe(stripeSecretKey, {
     *   apiVersion: '2023-10-16', // Use latest API version
     * });
     * 
     * // Create a charge using the payment token
     * const charge = await stripe.charges.create({
     *   amount: Math.round(body.total * 100), // Convert to cents
     *   currency: 'usd',
     *   source: paymentToken, // The token from client
     *   description: `Order for ${body.customer.email}`,
     *   metadata: {
     *     customer_email: body.customer.email,
     *     customer_name: body.customer.name,
     *     item_count: body.items.length.toString(),
     *   },
     *   receipt_email: body.customer.email,
     * });
     * 
     * console.log('Payment successful:', {
     *   chargeId: charge.id,
     *   amount: charge.amount,
     *   status: charge.status,
     * });
     * 
     * // Alternative: Use Payment Intents API (recommended for SCA compliance)
     * const paymentIntent = await stripe.paymentIntents.create({
     *   amount: Math.round(body.total * 100),
     *   currency: 'usd',
     *   payment_method: paymentToken, // Token ID
     *   confirm: true,
     *   description: `Order for ${body.customer.email}`,
     *   metadata: {
     *     customer_email: body.customer.email,
     *   },
     * });
     * ```
     */
    
    // TEMPORARY MOCK RESPONSE (for development/testing)
    // Replace this with actual Stripe integration above
    const mockSuccess = true; // Set to false to test error handling
    
    if (mockSuccess) {
      // Simulate successful payment
      const mockTransactionId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const mockOrderId = `ORD-${Date.now()}`;
      
      console.log('✅ MOCK Payment successful:', {
        orderId: mockOrderId,
        transactionId: mockTransactionId,
        amount: body.total,
      });
      
      // ==========================================
      // STEP 4: Post-Payment Processing
      // ==========================================
      /**
       * TODO: After successful payment, you should:
       * 
       * 1. Save order to database
       * 2. Send confirmation email to customer
       * 3. Update inventory
       * 4. Create invoice
       * 5. Trigger order fulfillment workflow
       */
      
      // Return success response
      const response: CheckoutResponse = {
        success: true,
        message: 'Payment processed successfully',
        orderId: mockOrderId,
        transactionId: mockTransactionId,
      };
      
      return NextResponse.json(response, { status: 200 });
      
    } else {
      // Simulate payment failure
      throw new Error('Payment declined by card issuer');
    }
    
  } catch (error) {
    // ==========================================
    // ERROR HANDLING
    // ==========================================
    console.error('Checkout error:', error);
    
    // Determine error message
    let errorMessage = 'Payment processing failed';
    
    if (error instanceof Error) {
      // Check for specific Stripe errors
      if (error.message.includes('declined')) {
        errorMessage = 'Payment was declined. Please try a different payment method.';
      } else if (error.message.includes('insufficient')) {
        errorMessage = 'Insufficient funds. Please try a different card.';
      } else if (error.message.includes('expired')) {
        errorMessage = 'Card has expired. Please use a different card.';
      }
      
      console.error('Error details:', error.message);
    }
    
    const response: CheckoutResponse = {
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : 'Unknown error')
        : undefined, // Only expose detailed errors in development
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * GET /api/checkout
 * 
 * Not allowed - checkout must use POST for security
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to process checkout.' },
    { status: 405 }
  );
}

