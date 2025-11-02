import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Order ID</p>
              <p className="font-mono text-lg font-semibold text-gray-900">
                #{orderId.slice(0, 8).toUpperCase()}
              </p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div className="flex items-center text-left">
              <Package className="h-5 w-5 text-blue-700 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Processing</p>
                <p className="text-sm text-gray-600">We're preparing your order</p>
              </div>
            </div>
            <div className="flex items-center text-left opacity-50">
              <Package className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Shipped</p>
                <p className="text-sm text-gray-600">Your order is on its way</p>
              </div>
            </div>
            <div className="flex items-center text-left opacity-50">
              <Package className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Delivered</p>
                <p className="text-sm text-gray-600">Enjoy your purchase!</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/orders"
              className="w-full bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-800 transition-colors inline-flex items-center justify-center"
            >
              View Order Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/products"
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;