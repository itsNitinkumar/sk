import axios from 'axios';

interface PaymentCreateResponse {
  success: boolean;
  key: string;
  order: {
    id: string;
    amount: number;
    currency: string;
  };
}

interface PaymentVerifyResponse {
  success: boolean;
  message: string;
  data?: {
    transactionId: string;
    amount: number;
    status: string;
  };
}

class PaymentService {
  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    };
  }

  static async createPayment(courseId: string, amount: number): Promise<PaymentCreateResponse> {
    try {
      const response = await axios.post('/api/v1/payments/create', 
        { courseId, amount },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create payment');
    }
  }

  static async verifyPayment(data: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    courseId: string;
  }): Promise<PaymentVerifyResponse> {
    try {
      const response = await axios.post('/api/v1/payments/verify',
        data,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
  }

  static loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  static initializeRazorpayPayment(options: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (response: any) => reject(response.error));
      rzp.open();
    });
  }
}

export default PaymentService;