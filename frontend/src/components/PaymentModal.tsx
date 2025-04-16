import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

interface PaymentModalProps {
  course: {
    id: string;
    title: string;
    price: number;
  };
  onClose: () => void;
  onSuccess?: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ course, onClose, onSuccess }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      // Make sure to use the correct API URL
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      
      const response = await fetch(`${API_URL}/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          courseId: course.id,
          amount: course.price
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      // Initialize Razorpay
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: "INR",
        name: "Learn Sphere",
        description: `Purchase ${course.title}`,
        order_id: data.order.id,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch(`${API_URL}/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                courseId: course.id
              })
            });

            if (!verifyResponse.ok) {
              throw new Error(`HTTP error! status: ${verifyResponse.status}`);
            }

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              toast.success('Payment successful! Course access granted.');
              onSuccess?.();
              onClose();
              router.refresh();
            } else {
              throw new Error(verifyData.message || 'Payment verification failed');
            }
          } catch (error: any) {
            console.error('Payment verification failed:', error);
            toast.error(error.message || 'Payment verification failed');
          }
        },
        prefill: {
          email: user.email,
          name: user.name
        },
        theme: {
          color: "#dc2626"
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment initiation failed:', error);
      toast.error(error.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Purchase Course</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">{course.title}</h3>
          <p className="text-gray-600">Price: ₹{course.price}</p>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full ${
            loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'
          } text-white py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Processing...
            </>
          ) : (
            'Proceed to Payment'
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;






