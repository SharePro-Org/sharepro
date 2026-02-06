/**
 * Flutterwave v4 Card Encryption Service
 *
 * Uses AES-256-GCM encryption with the encryption key from the Flutterwave dashboard.
 * The nonce is a randomly generated 12-character string (not fetched from any API).
 *
 * @see https://developer.flutterwave.com/docs/encryption
 */

interface CardData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
}

export interface EncryptedCardData {
  nonce: string;
  encryptedCardNumber: string;
  encryptedExpiryMonth: string;
  encryptedExpiryYear: string;
  encryptedCvv: string;
  cardHolderName: string;
}

/**
 * Sanitize card number - remove spaces and dashes
 */
export function sanitizeCardNumber(cardNumber: string): string {
  return cardNumber.replace(/\s/g, '').replace(/-/g, '');
}

/**
 * Validate card number using Luhn algorithm
 */
export function validateCardNumber(cardNumber: string): boolean {
  const sanitized = sanitizeCardNumber(cardNumber);

  if (!sanitized.match(/^\d{13,19}$/)) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Validate card expiry
 */
export function validateExpiry(expiryMonth: string, expiryYear: string): boolean {
  const month = parseInt(expiryMonth, 10);
  const year = parseInt(expiryYear, 10);

  if (month < 1 || month > 12) {
    return false;
  }

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) {
    return false;
  }

  if (year === currentYear && month < currentMonth) {
    return false;
  }

  return true;
}

/**
 * Validate CVV (3-4 digits)
 */
export function validateCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv);
}

/**
 * Generate a random 12-character nonce for AES-256-GCM encryption.
 */
function generateNonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(12);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join('');
}

/**
 * Encrypt a single value using AES-256-GCM.
 *
 * @param plaintext - The value to encrypt
 * @param encryptionKey - Base64-encoded encryption key from Flutterwave dashboard
 * @param nonce - 12-character nonce string
 * @returns Base64-encoded ciphertext (includes GCM auth tag)
 */
async function encryptAES256GCM(
  plaintext: string,
  encryptionKey: string,
  nonce: string
): Promise<string> {
  // Decode the base64 encryption key
  const keyBytes = Uint8Array.from(atob(encryptionKey), (c) => c.charCodeAt(0));

  // Import the key for AES-GCM
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  // Encode nonce and plaintext
  const encoder = new TextEncoder();
  const iv = encoder.encode(nonce);
  const data = encoder.encode(plaintext);

  // Encrypt
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    data
  );

  // Convert to base64
  const encryptedArray = new Uint8Array(encrypted);
  return btoa(String.fromCharCode(...encryptedArray));
}

/**
 * Validate card data before encryption.
 */
export function validateCardData(cardData: CardData): void {
  if (!validateCardNumber(cardData.cardNumber)) {
    throw new Error('Invalid card number');
  }

  if (!validateExpiry(cardData.expiryMonth, cardData.expiryYear)) {
    throw new Error('Card has expired or invalid expiry date');
  }

  if (!validateCVV(cardData.cvv)) {
    throw new Error('Invalid CVV (must be 3-4 digits)');
  }

  if (!cardData.cardholderName?.trim()) {
    throw new Error('Cardholder name is required');
  }
}

/**
 * Encrypt card data using AES-256-GCM for Flutterwave v4 API.
 *
 * Generates a random 12-char nonce, encrypts each card field individually
 * using the encryption key from the Flutterwave dashboard, and returns
 * the encrypted fields + nonce for the payment method API request.
 *
 * @param cardData - Card details to encrypt
 * @returns Encrypted card data with nonce
 */
export async function encryptCardData(cardData: CardData): Promise<EncryptedCardData> {
  const encryptionKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_ENCRYPTION_KEY;

  if (!encryptionKey) {
    throw new Error('NEXT_PUBLIC_FLUTTERWAVE_ENCRYPTION_KEY not configured');
  }

  const sanitizedCardNumber = sanitizeCardNumber(cardData.cardNumber);
  const expiryMonth = cardData.expiryMonth.padStart(2, '0');
  const expiryYear = cardData.expiryYear.slice(-2);

  // Generate a random 12-character nonce
  const nonce = generateNonce();

  // Encrypt each field with AES-256-GCM using the same nonce
  const [
    encrypted_card_number,
    encrypted_expiry_month,
    encrypted_expiry_year,
    encrypted_cvv,
  ] = await Promise.all([
    encryptAES256GCM(sanitizedCardNumber, encryptionKey, nonce),
    encryptAES256GCM(expiryMonth, encryptionKey, nonce),
    encryptAES256GCM(expiryYear, encryptionKey, nonce),
    encryptAES256GCM(cardData.cvv, encryptionKey, nonce),
  ]);

  return {
    nonce,
    encryptedCardNumber: encrypted_card_number,
    encryptedExpiryMonth: encrypted_expiry_month,
    encryptedExpiryYear: encrypted_expiry_year,
    encryptedCvv: encrypted_cvv,
    cardHolderName: cardData.cardholderName,
  };
}
