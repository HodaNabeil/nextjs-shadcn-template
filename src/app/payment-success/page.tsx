export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-sm border border-green-100">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-green-600 mb-2">
          تم الدفع بنجاح!
        </h1>
        <p className="text-gray-600 text-sm">
          شكراً لك، تم استقبال طلبك بنجاح وجاري تفعيل حسابك الآن.
        </p>
      </div>
    </div>
  );
}
