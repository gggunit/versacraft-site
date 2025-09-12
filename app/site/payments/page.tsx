export default function PaymentsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold mb-4">Payments</h1>
        <p className="text-lg text-gray-600 mb-6">
          Secure payment processing powered by Stripe
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Payment Options</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Credit/Debit Cards (Visa, MasterCard, Amex)</li>
            <li>• Apple Pay & Google Pay</li>
            <li>• ACH Bank Transfers</li>
            <li>• Digital Wallets</li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Payment Terms</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Payment due at time of service</li>
            <li>• 24-hour cancellation policy</li>
            <li>• Secure processing via Stripe</li>
            <li>• Receipts sent automatically</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> This is a staging environment using Stripe test mode. 
          No real payments will be processed.
        </p>
      </div>
    </main>
  );
}
