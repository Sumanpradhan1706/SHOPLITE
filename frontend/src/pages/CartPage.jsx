export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h1>
          <div className="text-center text-gray-600 py-12">
            <p className="text-xl">Your cart is empty</p>
            <p className="mt-2">Add some products to get started!</p>
          </div>
          <div className="mt-8 border-t pt-6">
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span className="text-blue-600">$0.00</span>
            </div>
            <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
