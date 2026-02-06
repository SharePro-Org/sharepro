import { AddPaymentMethodV4Form } from '@/components/payment/AddPaymentMethodV4Form';

export default function PaymentMethodsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Payment Methods</h1>
          <p className="text-gray-600 mt-2">
            Securely add and manage your payment methods for future transactions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <AddPaymentMethodV4Form />
            </div>
          </div>

          {/* Side Info */}
          <div className="space-y-4">
            {/* Security Info */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                🔒 Security
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                Your card information is encrypted in your browser using Flutterwave's
                encryption library. We never see your card details.
              </p>
            </div>

            {/* Features */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                ✨ Features
              </h3>
              <ul className="text-xs text-gray-700 space-y-2">
                <li>✓ Instant payment method creation</li>
                <li>✓ No payment authorization needed</li>
                <li>✓ Ready to use immediately</li>
                <li>✓ Secure card tokenization</li>
              </ul>
            </div>

            {/* Test Cards */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-sm mb-2">🧪 Test Cards</h3>
              <div className="space-y-2 text-xs text-gray-700">
                <div>
                  <strong>Visa:</strong>
                  <br />
                  4242 4242 4242 4242
                </div>
                <div>
                  <strong>Expiry:</strong>
                  <br />
                  09/32
                </div>
                <div>
                  <strong>CVV:</strong>
                  <br />
                  123
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-sm mb-2">❓ FAQ</h3>
              <div className="space-y-3 text-xs text-gray-700">
                <div>
                  <strong className="block mb-1">Is my data safe?</strong>
                  Yes, card data is encrypted before leaving your browser.
                </div>
                <div>
                  <strong className="block mb-1">Will I be charged?</strong>
                  No, adding a payment method doesn't charge your card.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
