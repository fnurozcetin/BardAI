declare module '@coinbase/onchainkit/minikit' {
  export function useNotification(): (notification: {
    title: string;
    body: string;
  }) => Promise<void>;

  export function useMiniKit(): {
    setFrameReady: () => void;
    isFrameReady: boolean;
    context: any;
  };

  export function useAddFrame(): () => Promise<boolean>;

  export function useOpenUrl(): (url: string) => void;

  export function MiniKitProvider(props: {
    children: React.ReactNode;
    apiKey?: string;
    chain?: any;
    config?: any;
  }): JSX.Element;
}
