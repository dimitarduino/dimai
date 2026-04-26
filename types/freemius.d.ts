declare global {
  interface Window {
    FS?: {
      Checkout: new (config: {
        product_id: string;
        plan_id: string;
        public_key: string;
        image: string;
      }) => {
        open: (options: {
          name: string;
          licenses: number;
          purchaseCompleted?: (response: {
            user: { email: string };
            license: { key: string };
          }) => void;
          success?: (response: {
            user: { email: string };
            license: { key: string };
          }) => void;
        }) => void;
      };
    };
  }
}

export type FreemiusMock = {
  api: {
    product: {
      retrieve: () => Promise<{ error: string }>;
    };
  };
  checkout: {
    getSandboxParams: () => Promise<{ error: string }>;
  };
};
