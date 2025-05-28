export {};

declare global {
  interface Window {
    Naver: {
      Pay: {
        create: (config: {
          mode: "development" | "production";
          clientId: string;
          chainId: string;
        }) => {
          open: (params: {
            merchantPayKey: string;
            productName: string;
            productCount: string;
            totalPayAmount: string;
            taxScopeAmount: string;
            taxExScopeAmount: string;
            returnUrl: string;
          }) => void;
        };
      };
    };
  }
}
