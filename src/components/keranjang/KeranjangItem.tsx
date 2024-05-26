"use client";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface CartItem {
  [key: string]: number;
}

interface Cart {
  email: string;
  items: CartItem;
  totalPrice: number;
}

const KeranjangItem = () => {
  const router = useRouter();

  const [cart, setCart] = useState<Cart | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const email = localStorage.getItem("email");
        const token = localStorage.getItem('Authorization');
        if (!email || !token) {
          throw new Error('Unauthorized');
        }

        const response = await axios.get(`/api/cart/view/${email}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setCart(response.data);
        setError('');
      } catch (error: any) {
        if (error.response && error.response.status === 403) {
          setError('Forbidden: You do not have access to this page, please login as pembeli');
        } else {
          setError('Failed to fetch cart');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const clearCart = async () => {
    try {
      const email = localStorage.getItem("email");
      const token = localStorage.getItem('Authorization');
      if (!email || !token) {
        throw new Error('Unauthorized');
      }

      await axios.delete(`/api/cart/clear/${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      await fetchCart();
      setError('');
    } catch (error) {
      setError('Failed to clear cart');
    }
  };

  const incrementItem = async (itemId: string) => {
    try {
      const email = localStorage.getItem("email");
      const token = localStorage.getItem('Authorization');
      if (!email || !token) {
        throw new Error('Unauthorized');
      }

      await axios.post(`/api/cart/increment`, null, {
        params: { email, itemId },
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      await fetchCart();
      setError('');
    } catch (error) {
      setError('Failed to increment item');
    }
  };

  const decrementItem = async (itemId: string) => {
    try {
      const email = localStorage.getItem("email");
      const token = localStorage.getItem('Authorization');
      if (!email || !token) {
        throw new Error('Unauthorized');
      }

      await axios.post(`/api/cart/decrement`, null, {
        params: { email, itemId },
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      await fetchCart();
      setError('');
    } catch (error) {
      setError('Failed to decrement item');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const email = localStorage.getItem("email");
      const token = localStorage.getItem('Authorization');
      if (!email || !token) {
        throw new Error('Unauthorized');
      }

      await axios.delete(`/api/cart/remove`, {
        params: { email, itemId },
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      await fetchCart();
      setError('');
    } catch (error) {
      setError('Failed to remove item');
    }
  };

  const fetchCart = async () => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem('Authorization');
    if (!email || !token) {
      throw new Error('Unauthorized');
    }

    const response = await axios.get(`/api/cart/view/${email}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    setCart(response.data);
  };

  if (loading) return <div>Loading...</div>;

  if (!cart) return <div>No cart data</div>;

  return (
      <div className="flex flex-col items-center py-2 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Keranjang Belanja</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <p className="text-xl mb-4"><strong>Email:</strong> {cart.email}</p>
        <div className="w-full max-w-4xl space-y-4">
          {Object.keys(cart.items).map((itemId) => (
            <div key={itemId} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
              <p className="text-lg"><strong>Item ID:</strong> {itemId} - <strong>Quantity:</strong> {cart.items[itemId]}</p>
              <div className="flex space-x-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600"
                  onClick={() => incrementItem(itemId)}
                >
                  +
                </button>
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded-full hover:bg-yellow-600"
                  onClick={() => decrementItem(itemId)}
                >
                  -
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600"
                  onClick={() => removeItem(itemId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xl mt-6"><strong>Total Price:</strong> {cart.totalPrice}</p>
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-full mt-6 hover:bg-blue-600"
          onClick={clearCart}
        >
          Clear Cart
        </button>
      </div>
  );
};

export default KeranjangItem;
