import { Freemius, type FreemiusConfig } from '@freemius/sdk';
import type { FreemiusMock } from '@/types/freemius';

let freemiusInstance: Freemius | null = null;

const CONFIG_ERROR: Readonly<{ error: 'Freemius not configured' }> = {
  error: 'Freemius not configured',
} as const;

function createUnconfiguredMock(): FreemiusMock {
  return {
    api: {
      product: {
        retrieve: async () => ({ error: CONFIG_ERROR.error }),
      },
    },
    checkout: {
      getSandboxParams: async () => ({ error: CONFIG_ERROR.error }),
    },
  } satisfies FreemiusMock;
}

function readFreemiusConfigFromEnv(): FreemiusConfig | null {
  const productId = process.env.FREEMIUS_PRODUCT_ID;
  const apiKey = process.env.FREEMIUS_API_KEY;
  const secretKey = process.env.FREEMIUS_SECRET_KEY;
  const publicKey = process.env.FREEMIUS_PUBLIC_KEY;

  if (!productId || !apiKey || !secretKey || !publicKey) {
    return null;
  }

  return {
    productId,
    apiKey,
    secretKey,
    publicKey,
  };
}

function createFreemiusOrMock(): Freemius | FreemiusMock {
  if (freemiusInstance) {
    return freemiusInstance;
  }

  const config = readFreemiusConfigFromEnv();
  if (!config) {
    console.warn('Freemius environment variables not fully configured');
    return createUnconfiguredMock();
  }

  freemiusInstance = new Freemius(config);
  return freemiusInstance;
}

export const freemius: Freemius | FreemiusMock = createFreemiusOrMock();

type FreemiusProductRetrieve = Awaited<
  ReturnType<InstanceType<typeof Freemius>['api']['product']['retrieve']>
>;

type TestConnectionResult = FreemiusProductRetrieve | { error: string };

export async function testFreemiusConnection(): Promise<TestConnectionResult> {
  try {
    const product = await freemius.api.product.retrieve();
    if (process.env.NODE_ENV === 'development') {
      console.log('Freemius product:', product);
    }
    return product;
  } catch (error: unknown) {
    console.error('Freemius connection error:', error);
    throw error;
  }
}
