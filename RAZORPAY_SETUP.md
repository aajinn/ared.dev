# Razorpay Integration Setup

## Prerequisites

1. Create a Razorpay account at https://razorpay.com/
2. Get your API keys from the Razorpay Dashboard

## Configuration

1. Update `.env.local` with your Razorpay credentials:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

2. For production, use live keys:
   - `rzp_live_xxxxxxxxxx` for Key ID
   - Update the secret key accordingly

## How It Works

### Payment Flow

1. User clicks "Buy Now" button on project page
2. Frontend calls `/api/create-order` to create a Razorpay order
3. Razorpay checkout modal opens with order details
4. User completes payment
5. On success, payment is verified via `/api/verify-payment`
6. User is redirected to `/success` page

### API Routes

- `POST /api/create-order` - Creates a new Razorpay order
- `POST /api/verify-payment` - Verifies payment signature

### Security

- Payment signature is verified using HMAC SHA256
- Secret key is never exposed to the client
- All sensitive operations happen on the server

## Testing

Use Razorpay test cards:
- Card Number: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

## Important Notes

- Amounts are in paise (multiply by 100)
- Always verify payment signature on the server
- Never expose your secret key to the client
- Use environment variables for all credentials
