'use client';

import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { INITIATE_ADD_PAYMENT_METHOD, AUTHORIZE_CARD_CHARGE, INITIATE_SUBSCRIPTION_WITH_CARD } from '@/apollo/mutations/payment-methods';
import { validateCardData, encryptCardData, encryptAES256GCM, generateNonce } from '@/lib/flutterwave-encryption';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

type Step = 'card_input' | 'pin_required' | 'otp_required' | 'processing' | 'success';

interface AddPaymentMethodV4FormProps {
  isDefault?: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
  showHeader?: boolean;
  showTestCard?: boolean;
  showDefaultToggle?: boolean;
  // Subscription props — when planId is set, form charges plan price and creates subscription
  planId?: string;
  planName?: string;
  planPrice?: number;
  subscriptionId?: string;
  isRenewal?: boolean;
}

interface FormState {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
  isDefault: boolean;
}

interface FormErrors {
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  cardholderName?: string;
  submit?: string;
}

interface MutationResponseFields {
  success: boolean;
  message?: string;
  chargeId?: string;
  nextActionType?: string;
  redirectUrl?: string;
  paymentInstruction?: string;
  paymentMethodId?: string;
  status?: string;
  errors?: string[];
}

interface InitiateAddPaymentMethodData {
  initiateAddPaymentMethod: MutationResponseFields;
}

interface InitiateSubscriptionWithCardData {
  initiateSubscriptionWithCard: MutationResponseFields & { subscriptionId?: string };
}

interface AuthorizeCardChargeData {
  authorizeCardCharge: MutationResponseFields & { subscriptionId?: string };
}

function getCardBrand(number: string): string | null {
  const cleaned = number.replace(/\s/g, '');
  if (/^4/.test(cleaned)) return 'Visa';
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'Mastercard';
  if (/^3[47]/.test(cleaned)) return 'Amex';
  if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
  if (/^(?:2131|1800|35)/.test(cleaned)) return 'JCB';
  return null;
}

export function AddPaymentMethodV4Form({
  isDefault: isDefaultProp = false,
  onSuccess,
  showHeader = true,
  showTestCard = false,
  showDefaultToggle = true,
  planId,
  planName,
  planPrice,
  subscriptionId,
  isRenewal = false,
}: AddPaymentMethodV4FormProps) {
  const isSubscriptionMode = !!planId;
  const [step, setStep] = useState<Step>('card_input');
  const [chargeId, setChargeId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormState>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    isDefault: isDefaultProp,
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, isDefault: isDefaultProp }));
  }, [isDefaultProp]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [pinValue, setPinValue] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [paymentInstruction, setPaymentInstruction] = useState<string | null>(null);

  const cardBrand = getCardBrand(formData.cardNumber);

  const [initiateAddPaymentMethod] = useMutation<InitiateAddPaymentMethodData>(INITIATE_ADD_PAYMENT_METHOD);
  const [initiateSubscriptionWithCard] = useMutation<InitiateSubscriptionWithCardData>(INITIATE_SUBSCRIPTION_WITH_CARD);
  const [authorizeCardCharge] = useMutation<AuthorizeCardChargeData>(AUTHORIZE_CARD_CHARGE);

  const handleResponse = (data: {
    success: boolean;
    message?: string;
    chargeId?: string;
    nextActionType?: string;
    redirectUrl?: string;
    paymentInstruction?: string;
    paymentMethodId?: string;
    errors?: string[];
  }) => {
    if (!data.success) {
      setErrors({ submit: data.errors?.join(', ') || data.message || 'Operation failed' });
      setLoading(false);
      return;
    }

    if (data.chargeId) {
      setChargeId(data.chargeId);
    }

    const nextAction = data.nextActionType;

    if (!nextAction || data.paymentMethodId) {
      // Charge succeeded immediately
      setStep('success');
      setSuccessMsg(data.message || (isSubscriptionMode ? 'Subscription activated!' : 'Payment method added successfully!'));
      setLoading(false);
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      } else {
        setTimeout(() => window.location.reload(), 2000);
      }
      return;
    }

    if (nextAction === 'redirect_url' && data.redirectUrl) {
      window.location.href = data.redirectUrl;
      return;
    }

    if (nextAction === 'requires_pin') {
      setStep('pin_required');
      setLoading(false);
      return;
    }

    if (nextAction === 'requires_otp') {
      setStep('otp_required');
      setSuccessMsg(data.message || null);
      setLoading(false);
      return;
    }

    if (nextAction === 'payment_instruction') {
      setPaymentInstruction(data.paymentInstruction || data.message || 'Follow the instructions from your bank.');
      setLoading(false);
      return;
    }

    // Unknown next_action - show message
    setErrors({ submit: `Unexpected authorization type: ${nextAction}` });
    setLoading(false);
  };

  // Card form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value.replace(/\D/g, '');
    if (value.length > 0) {
      value = value.replace(/(\d{4})/g, '$1 ').trim();
    }
    setFormData((prev) => ({ ...prev, cardNumber: value }));
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: undefined }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setFormData((prev) => ({ ...prev, expiryMonth: value }));
    if (errors.expiry) {
      setErrors((prev) => ({ ...prev, expiry: undefined }));
    }
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.replace(/\D/g, '').slice(0, 4);
    setFormData((prev) => ({ ...prev, cvv: value }));
    if (errors.cvv) {
      setErrors((prev) => ({ ...prev, cvv: undefined }));
    }
  };

  // Step 1: Submit card form → orchestrator
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMsg(null);

    try {
      const [month, year] = formData.expiryMonth.split('/');

      const cardData = {
        cardNumber: formData.cardNumber,
        expiryMonth: month || formData.expiryMonth,
        expiryYear: year || formData.expiryYear,
        cvv: formData.cvv,
        cardholderName: formData.cardholderName,
      };

      validateCardData(cardData);
      const encryptedData = await encryptCardData(cardData);

      if (isSubscriptionMode) {
        // Subscription flow: charge plan price and create subscription
        const { data } = await initiateSubscriptionWithCard({
          variables: {
            input: {
              planId,
              subscriptionId: subscriptionId || undefined,
              isRenewal,
              nonce: encryptedData.nonce,
              encryptedCardNumber: encryptedData.encryptedCardNumber,
              encryptedExpiryMonth: encryptedData.encryptedExpiryMonth,
              encryptedExpiryYear: encryptedData.encryptedExpiryYear,
              encryptedCvv: encryptedData.encryptedCvv,
              cardHolderName: encryptedData.cardHolderName,
            },
          },
        });
        if (!data) throw new Error('No response from server');
        handleResponse(data.initiateSubscriptionWithCard);
      } else {
        // Add payment method flow: charge 50 NGN for verification
        const { data } = await initiateAddPaymentMethod({
          variables: {
            input: {
              nonce: encryptedData.nonce,
              encryptedCardNumber: encryptedData.encryptedCardNumber,
              encryptedExpiryMonth: encryptedData.encryptedExpiryMonth,
              encryptedExpiryYear: encryptedData.encryptedExpiryYear,
              encryptedCvv: encryptedData.encryptedCvv,
              cardHolderName: encryptedData.cardHolderName,
              isDefault: formData.isDefault,
            },
          },
        });
        if (!data) throw new Error('No response from server');
        handleResponse(data.initiateAddPaymentMethod);
      }
    } catch (err: any) {
      setErrors({ submit: err.message || 'Failed to process card' });
      setLoading(false);
    }
  };

  // Step 2a: Submit PIN authorization
  const handlePinSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chargeId || !pinValue) return;

    setLoading(true);
    setErrors({});

    try {
      const encryptionKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_ENCRYPTION_KEY;
      if (!encryptionKey) throw new Error('Encryption key not configured');

      const nonce = generateNonce();
      const encryptedPin = await encryptAES256GCM(pinValue, encryptionKey, nonce);

      const { data } = await authorizeCardCharge({
        variables: {
          input: {
            chargeId,
            authorizationType: 'pin',
            pinNonce: nonce,
            encryptedPin,
            isDefault: formData.isDefault,
            ...(isSubscriptionMode && {
              planId,
              subscriptionId: subscriptionId || undefined,
              isRenewal,
            }),
          },
        },
      });

      if (!data) throw new Error('No response from server');
      handleResponse(data.authorizeCardCharge);
    } catch (err: any) {
      setErrors({ submit: err.message || 'Failed to authorize PIN' });
      setLoading(false);
    }
  };

  // Step 2b: Submit OTP authorization
  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chargeId || !otpValue) return;

    setLoading(true);
    setErrors({});

    try {
      const { data } = await authorizeCardCharge({
        variables: {
          input: {
            chargeId,
            authorizationType: 'otp',
            otpCode: otpValue,
            isDefault: formData.isDefault,
            ...(isSubscriptionMode && {
              planId,
              subscriptionId: subscriptionId || undefined,
              isRenewal,
            }),
          },
        },
      });

      if (!data) throw new Error('No response from server');
      handleResponse(data.authorizeCardCharge);
    } catch (err: any) {
      setErrors({ submit: err.message || 'Failed to verify OTP' });
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('card_input');
    setChargeId(null);
    setErrors({});
    setSuccessMsg(null);
    setPinValue('');
    setOtpValue('');
    setPaymentInstruction(null);
    setFormData({
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardholderName: '',
      isDefault: isDefaultProp,
    });
  };

  return (
    <div className="w-full">
      <div className="space-y-4">
        {/* Header */}
        {showHeader && (
          <div>
            <h2 className="text-2xl font-bold">Add Payment Method</h2>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
              <Lock size={14} />
              Your card data is encrypted before transmission
            </p>
          </div>
        )}

        {/* Error Alert */}
        {errors.submit && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
            <span className="text-red-700">{errors.submit}</span>
          </div>
        )}

        {/* Success Alert */}
        {step === 'success' && successMsg && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200 text-sm">
            <CheckCircle className="h-4 w-4 shrink-0 text-green-500 mt-0.5" />
            <span className="text-green-700">{successMsg}</span>
          </div>
        )}

        {/* Payment Instruction */}
        {paymentInstruction && step !== 'success' && (
          <div className="space-y-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-blue-800 mb-1">Follow These Instructions</p>
                <p className="text-blue-700 text-xs leading-relaxed">{paymentInstruction}</p>
              </div>
            </div>
          </div>
        )}

        {/* Plan Info Banner (subscription mode) */}
        {isSubscriptionMode && planName && step === 'card_input' && (
          <div className="rounded-lg bg-[#ECF3FF] border border-[#D1DAF4] p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Subscribing to</p>
                <p className="font-semibold text-base mt-0.5">{planName} Plan</p>
              </div>
              {planPrice !== undefined && (
                <div className="text-right">
                  <p className="font-bold text-lg">
                    {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(planPrice)}
                  </p>
                  <p className="text-xs text-gray-500">/month</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== STEP: Card Input ===== */}
        {step === 'card_input' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card Number with brand detection */}
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1.5">
                Card Number
              </label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  type="text"
                  name="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  value={formData.cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={25}
                  disabled={loading}
                  className={errors.cardNumber ? 'border-red-400' : ''}
                  required
                />
                {cardBrand && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {cardBrand}
                  </span>
                )}
              </div>
              {errors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
              )}
            </div>

            {/* Cardholder Name */}
            <div>
              <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1.5">
                Cardholder Name
              </label>
              <Input
                id="cardholderName"
                type="text"
                name="cardholderName"
                placeholder="Full name on card"
                value={formData.cardholderName}
                onChange={handleChange}
                disabled={loading}
                className={errors.cardholderName ? 'border-red-400' : ''}
                required
              />
              {errors.cardholderName && (
                <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>
              )}
            </div>

            {/* Expiry and CVV Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Expiry Date
                </label>
                <Input
                  id="expiryMonth"
                  type="text"
                  name="expiryMonth"
                  placeholder="MM/YY"
                  value={formData.expiryMonth}
                  onChange={handleExpiryChange}
                  maxLength={5}
                  disabled={loading}
                  className={errors.expiry ? 'border-red-400' : ''}
                  required
                />
                {errors.expiry && (
                  <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>
                )}
              </div>

              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1.5">
                  CVV
                </label>
                <Input
                  id="cvv"
                  type="password"
                  name="cvv"
                  placeholder="***"
                  value={formData.cvv}
                  onChange={handleCVVChange}
                  maxLength={4}
                  disabled={loading}
                  className={errors.cvv ? 'border-red-400' : ''}
                  required
                />
                {errors.cvv && (
                  <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>

            {/* Set as Default Checkbox */}
            {showDefaultToggle && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-600">
                  Set as default payment method
                </label>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSubscriptionMode ? 'Processing Payment...' : 'Encrypting & Processing...'}
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  {isSubscriptionMode ? 'Pay & Subscribe' : 'Add Card Securely'}
                </>
              )}
            </Button>

            {/* Security Note */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
              <Lock size={12} />
              <span>256-bit encrypted. We never store your card details.</span>
            </div>
          </form>
        )}

        {/* ===== STEP: PIN Required ===== */}
        {step === 'pin_required' && (
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 shrink-0 text-yellow-600 mt-0.5" />
                <p className="text-yellow-700">
                  Your bank requires a PIN to authorize this card. Please enter your card PIN below.
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1.5">
                Card PIN
              </label>
              <Input
                id="pin"
                type="password"
                placeholder="Enter your card PIN"
                value={pinValue}
                onChange={(e) => setPinValue(e.currentTarget.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                disabled={loading}
                required
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={loading}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit" disabled={loading || !pinValue} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authorizing...
                  </>
                ) : (
                  'Authorize PIN'
                )}
              </Button>
            </div>
          </form>
        )}

        {/* ===== STEP: OTP Required ===== */}
        {step === 'otp_required' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                <p className="text-blue-700">
                  {successMsg || 'An OTP has been sent to your registered phone number or email. Please enter it below.'}
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1.5">
                One-Time Password (OTP)
              </label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otpValue}
                onChange={(e) => setOtpValue(e.currentTarget.value.replace(/\D/g, '').slice(0, 8))}
                maxLength={8}
                disabled={loading}
                required
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={loading}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit" disabled={loading || !otpValue} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Test Card Info */}
        {showTestCard && step === 'card_input' && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">Test Card (Sandbox)</h3>
            <div className="text-xs text-gray-700 space-y-1">
              <p><strong>Card:</strong> 4242 4242 4242 4242</p>
              <p><strong>Expiry:</strong> 09/32</p>
              <p><strong>CVV:</strong> 123</p>
              <p><strong>Name:</strong> Test User</p>
              <p><strong>PIN:</strong> 3310</p>
              <p><strong>OTP:</strong> 12345</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
