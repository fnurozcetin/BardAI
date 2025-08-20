"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "./components/DemoComponents";
import { Icon } from "./components/DemoComponents";
import { Home } from "./components/DemoComponents";
import { Features } from "./components/DemoComponents";
import { TeaCulture } from "./components/TeaCulture";
import { AIAssistant } from "./components/AIAssistant";
import { BlockchainLog } from "./components/BlockchainLog";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--app-accent)] p-4"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF] animate-fade-out">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <Home setActiveTab={setActiveTab} />;
      case "features":
        return <Features setActiveTab={setActiveTab} />;
      case "tea-culture":
        return <TeaCulture setActiveTab={setActiveTab} />;
      case "ai-assistant":
        return <AIAssistant setActiveTab={setActiveTab} />;
      case "blockchain-log":
        return <BlockchainLog setActiveTab={setActiveTab} />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-3 h-11">
          <div>
            <div className="flex items-center space-x-2">
              <Wallet className="z-10">
                <ConnectWallet>
                  <Name className="text-inherit" />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
            </div>
          </div>
          <div>{saveFrameButton}</div>
        </header>

        <main className="flex-1">
          {renderTabContent()}
        </main>

        <nav className="mt-4 flex justify-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("home")}
            className={`text-xs ${activeTab === "home" ? "text-[var(--app-accent)]" : "text-[var(--app-foreground-muted)]"}`}
          >
            🏠
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("tea-culture")}
            className={`text-xs ${activeTab === "tea-culture" ? "text-[var(--app-accent)]" : "text-[var(--app-foreground-muted)]"}`}
          >
            🍵
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("ai-assistant")}
            className={`text-xs ${activeTab === "ai-assistant" ? "text-[var(--app-accent)]" : "text-[var(--app-foreground-muted)]"}`}
          >
            🤖
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("blockchain-log")}
            className={`text-xs ${activeTab === "blockchain-log" ? "text-[var(--app-accent)]" : "text-[var(--app-foreground-muted)]"}`}
          >
            ⛓️
          </Button>
        </nav>

        <footer className="mt-2 pt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--ock-text-foreground-muted)] text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  );
}
