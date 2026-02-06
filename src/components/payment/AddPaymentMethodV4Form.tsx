'use client';

import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { ADD_PAYMENT_METHOD_V4 } from '@/apollo/mutations/payment-methods';
import { validateCardData, encryptCardData } from '@/lib/flutterwave-encryption';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lock, CheckCircle, AlertCircle } from 'lucide-react';

interface AddPaymentMethodV4FormProps {
  isDefault?: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
  showHeader?: boolean;
  showTestCard?: boolean;
  showDefaultToggle?: boolean;
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
}: AddPaymentMethodV4FormProps) {
  const [formData, setFormData] = useState<FormState>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    isDefault: isDefaultProp,
  });

  // Sync isDefault from parent prop when it changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, isDefault: isDefaultProp }));
  }, [isDefaultProp]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState<string | null>(null);

  const cardBrand = getCardBrand(formData.cardNumber);

  const [addPaymentMethod] = useMutation(ADD_PAYMENT_METHOD_V4, {
    onCompleted: (data: any) => {
      if (data.addPaymentMethodV4.success) {
        setSuccess(
          `Payment method added successfully!`
        );
        setFormData({
          cardNumber: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: '',
          cardholderName: '',
          isDefault: isDefaultProp,
        });
        setErrors({});

        if (onSuccess) {
          setTimeout(() => onSuccess(), 1500);
        } else {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      } else {
        setErrors({
          submit: data.addPaymentMethodV4.errors?.join(', ') || 'Failed to add payment method',
        });
        setSuccess(null);
      }
    },
    onError: (err: any) => {
      setErrors({
        submit: err.message || 'Failed to add payment method',
      });
      setSuccess(null);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value.replace(/\D/g, '');
    if (value.length > 0) {
      value = value.replace(/(\d{4})/g, '$1 ').trim();
    }
    setFormData((prev) => ({
      ...prev,
      cardNumber: value,
    }));
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: undefined }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setFormData((prev) => ({
      ...prev,
      expiryMonth: value,
    }));
    if (errors.expiry) {
      setErrors((prev) => ({ ...prev, expiry: undefined }));
    }
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.replace(/\D/g, '').slice(0, 4);
    setFormData((prev) => ({
      ...prev,
      cvv: value,
    }));
    if (errors.cvv) {
      setErrors((prev) => ({ ...prev, cvv: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(null);

    try {
      const [month, year] = formData.expiryMonth.split('/');

      const cardData = {
        cardNumber: formData.cardNumber,
        expiryMonth: month || formData.expiryMonth,
        expiryYear: year || formData.expiryYear,
        cvv: formData.cvv,
        cardholderName: formData.cardholderName,
      };

      // Step 1: Validate card data locally (fail fast)
      validateCardData(cardData);

      // Step 2: Encrypt card data with AES-256-GCM (generates nonce internally)
      const encryptedData = await encryptCardData(cardData);

      // Step 3: Send encrypted data to backend via v4 mutation
      await addPaymentMethod({
        variables: {
          input: {
            methodType: 'card',
            isDefault: formData.isDefault,
            gateway: 'flutterwave',
            encryptedCardData: encryptedData,
          },
        },
      });
    } catch (err: any) {
      setErrors({
        submit: err.message || 'Failed to process card',
      });
    } finally {
      setLoading(false);
    }
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
        {success && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200 text-sm">
            <CheckCircle className="h-4 w-4 shrink-0 text-green-500 mt-0.5" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* Card Form */}
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
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Encrypting & Saving...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Add Card Securely
              </>
            )}
          </Button>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <Lock size={12} />
            <span>256-bit encrypted. We never store your card details.</span>
          </div>
        </form>

        {/* Test Card Info */}
        {showTestCard && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">Test Card (Sandbox)</h3>
            <div className="text-xs text-gray-700 space-y-1">
              <p><strong>Card:</strong> 4242 4242 4242 4242</p>
              <p><strong>Expiry:</strong> 09/32</p>
              <p><strong>CVV:</strong> 123</p>
              <p><strong>Name:</strong> Test User</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
