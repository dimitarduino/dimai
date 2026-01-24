import { Freemius } from '@freemius/sdk';

// Initialize the Freemius SDK
// Only initialize if environment variables are available
let freemiusInstance = null;

export const freemius = (() => {
    if (!freemiusInstance) {
        // Check if required environment variables are set
        if (!process.env.FREEMIUS_PRODUCT_ID || 
            !process.env.FREEMIUS_API_KEY || 
            !process.env.FREEMIUS_SECRET_KEY || 
            !process.env.FREEMIUS_PUBLIC_KEY) {
            console.warn('Freemius environment variables not fully configured');
            // Return a mock object to prevent build errors
            return {
                api: {
                    product: {
                        retrieve: async () => ({ error: 'Freemius not configured' })
                    }
                },
                checkout: {
                    getSandboxParams: async () => ({ error: 'Freemius not configured' })
                }
            };
        }

        freemiusInstance = new Freemius({
            productId: process.env.FREEMIUS_PRODUCT_ID,
            apiKey: process.env.FREEMIUS_API_KEY,
            secretKey: process.env.FREEMIUS_SECRET_KEY,
            publicKey: process.env.FREEMIUS_PUBLIC_KEY,
        });
    }
    return freemiusInstance;
})();

// Helper function to test the connection (call this manually when needed)
export async function testFreemiusConnection() {
    try {
        const product = await freemius.api.product.retrieve();
        // Only log in development to avoid exposing sensitive data in build logs
        if (process.env.NODE_ENV === 'development') {
            console.log('Freemius product:', product);
        }
        return product;
    } catch (error) {
        console.error('Freemius connection error:', error);
        throw error;
    }
}