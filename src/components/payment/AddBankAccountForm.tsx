'use client';

import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { ADD_BANK_ACCOUNT_PAYMENT_METHOD } from '@/apollo/mutations/payment-methods';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lock, CheckCircle, AlertCircle } from 'lucide-react';

interface AddBankAccountFormProps {
  isDefault?: boolean;
  onSuccess?: () => void;
  onClose?: () => void;
  showHeader?: boolean;
}

interface FormState {
  accountNumber: string;
  accountName: string;
  bankCode: string;
  isDefault: boolean;
}

interface FormErrors {
  accountNumber?: string;
  accountName?: string;
  bankCode?: string;
  submit?: string;
}

// Common Nigerian bank codes
const BANK_CODES = [
  { code: '007', name: 'Zenith Bank' },
  { code: '009', name: 'FCMB' },
  { code: '011', name: 'First Bank' },
  { code: '012', name: 'UBA' },
  { code: '014', name: 'GTB' },
  { code: '015', name: 'Merchant Bank' },
  { code: '017', name: 'Skye Bank' },
  { code: '018', name: 'ECO Bank' },
  { code: '019', name: 'Heritage Bank' },
  { code: '020', name: 'Stanbic IBTC' },
  { code: '021', name: 'Citi Bank' },
  { code: '023', name: 'Bank PHB' },
  { code: '025', name: 'STANDARD CHARTERED BANK' },
  { code: '026', name: 'Intercontinental Bank' },
  { code: '027', name: 'ECOBANK NIGERIA' },
  { code: '028', name: 'Fidelity Bank' },
  { code: '029', name: 'Guaranty Trust Bank' },
  { code: '030', name: 'Bank of the North' },
  { code: '031', name: 'Mainstreet Bank' },
  { code: '032', name: 'Cobiz Bank' },
  { code: '033', name: 'POLARIS BANK' },
  { code: '035', name: 'Wema Bank' },
  { code: '036', name: 'DIAMOND BANK' },
  { code: '037', name: 'Access Bank' },
  { code: '039', name: 'Unity Bank' },
  { code: '041', name: 'BANK OF AGRICULTURE' },
  { code: '050', name: 'GUARANTY TRUST BANK' },
  { code: '051', name: 'Ecobank' },
  { code: '052', name: 'Fidelity Bank' },
  { code: '055', name: 'First Bank Nigeria' },
  { code: '056', name: 'Access Bank' },
  { code: '059', name: 'Zenith Bank' },
  { code: '063', name: 'Access Bank' },
  { code: '066', name: 'Central Bank' },
];

export function AddBankAccountForm({
  isDefault: isDefaultProp = false,
  onSuccess,
  onClose,
  showHeader = true,
}: AddBankAccountFormProps) {
  const [formData, setFormData] = useState<FormState>({
    accountNumber: '',
    accountName: '',
    bankCode: '',
    isDefault: isDefaultProp,
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, isDefault: isDefaultProp }));
  }, [isDefaultProp]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState<string | null>(null);

  const [addBankAccount] = useMutation(ADD_BANK_ACCOUNT_PAYMENT_METHOD, {
    onCompleted: (data: any) => {
      if (data.addBankAccountPaymentMethod.success) {
        setSuccess('Bank account added successfully!');
        setFormData({
          accountNumber: '',
          accountName: '',
          bankCode: '',
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
          submit: data.addBankAccountPaymentMethod.errors?.join(', ') || 'Failed to add bank account',
        });
        setSuccess(null);
      }
    },
    onError: (err: any) => {
      setErrors({
        submit: err.message || 'Failed to add bank account',
      });
      setSuccess(null);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.currentTarget as HTMLInputElement).checked : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!/^\d{10,}$/.test(formData.accountNumber.replace(/\s/g, ''))) {
      newErrors.accountNumber = 'Account number must be at least 10 digits';
    }

    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    } else if (formData.accountName.length < 2) {
      newErrors.accountName = 'Account name must be at least 2 characters';
    }

    if (!formData.bankCode.trim()) {
      newErrors.bankCode = 'Bank is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await addBankAccount({
        variables: {
          input: {
            methodType: 'bank_account',
            isDefault: formData.isDefault,
            gateway: 'flutterwave',
            bankAccountData: {
              accountNumber: formData.accountNumber.replace(/\s/g, ''),
              accountName: formData.accountName,
              bankCode: formData.bankCode,
            },
          },
        },
      });
    } catch (err: any) {
      setErrors({
        submit: err.message || 'Failed to process bank account',
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
            <h2 className="text-2xl font-bold">Add Bank Account</h2>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
              <Lock size={14} />
              Your bank details are securely transmitted
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bank Selection */}
          <div>
            <label htmlFor="bankCode" className="block text-sm font-medium text-gray-700 mb-1.5">
              Bank <span className="text-red-500">*</span>
            </label>
            <select
              id="bankCode"
              name="bankCode"
              value={formData.bankCode}
              onChange={handleChange}
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.bankCode ? 'border-red-400' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Select a bank</option>
              {BANK_CODES.map((bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
            {errors.bankCode && (
              <p className="text-red-500 text-xs mt-1">{errors.bankCode}</p>
            )}
          </div>

          {/* Account Number */}
          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1.5">
              Account Number <span className="text-red-500">*</span>
            </label>
            <Input
              id="accountNumber"
              type="text"
              name="accountNumber"
              placeholder="Enter account number"
              value={formData.accountNumber}
              onChange={handleChange}
              disabled={loading}
              className={errors.accountNumber ? 'border-red-400' : ''}
              required
            />
            {errors.accountNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>
            )}
          </div>

          {/* Account Name */}
          <div>
            <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1.5">
              Account Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="accountName"
              type="text"
              name="accountName"
              placeholder="Name on account"
              value={formData.accountName}
              onChange={handleChange}
              disabled={loading}
              className={errors.accountName ? 'border-red-400' : ''}
              required
            />
            {errors.accountName && (
              <p className="text-red-500 text-xs mt-1">{errors.accountName}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Add Bank Account
              </>
            )}
          </Button>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <Lock size={12} />
            <span>Your bank details are encrypted and secure.</span>
          </div>
        </form>
      </div>
    </div>
  );
}
