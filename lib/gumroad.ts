const GUMROAD_API_BASE = 'https://api.gumroad.com/v2';
const PRODUCT_ID = process.env.GUMROAD_PRODUCT_ID;

export interface GumroadProduct {
  success: boolean;
  product: {
    id: string;
    name: string;
    price: number;
    formatted_price: string;
    subscription_duration: string;
    short_url: string;
  };
}

export interface UserSubscription {
  planId: string;
  status: 'active' | 'cancelled' | 'none';
  expiresAt?: string;
}

export async function getProductDetails(): Promise<GumroadProduct> {
  const response = await fetch(`${GUMROAD_API_BASE}/products/${PRODUCT_ID}`, {
    headers: {
      'Authorization': `Bearer ${process.env.GUMROAD_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch product details');
  }

  return response.json();
}

export async function verifyLicense(licenseKey: string): Promise<boolean> {
  const response = await fetch(`${GUMROAD_API_BASE}/licenses/verify`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GUMROAD_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: PRODUCT_ID,
      license_key: licenseKey,
    }),
  });

  if (!response.ok) {
    return false;
  }

  const data = await response.json();
  return data.success;
}
