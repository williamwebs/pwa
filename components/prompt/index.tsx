"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setIsIOS(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );

    // Detect Android
    setIsAndroid(/Android/.test(navigator.userAgent));

    // Detect Desktop
    setIsDesktop(!isIOS && !isAndroid);

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    // Listen for install prompt (only on Android & Desktop)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.addEventListener("beforeinstallprompt", (e: any) => {
      e.preventDefault();
      setInstallEvent(e);
    });
  }, []);

  if (isStandalone) {
    return null;
  }

  const handleInstallClick = () => {
    if (installEvent) {
      installEvent.prompt();
    } else {
      console.error("No install event available");
    }
  };

  return (
    <section className="sticky top-0 bg-white/20 backdrop-blur">
      <div className="container mx-auto p-1">
        {!isStandalone && (
          <div>
            {isAndroid && (
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm">
                  Click the install button below to install this app on your
                  android device.
                </p>
                <button
                  onClick={handleInstallClick}
                  className="bg-blue-600 text-white text-sm p-2 rounded"
                >
                  Install App
                </button>
              </div>
            )}
            {isIOS && (
              <p className="text-xs sm:text-sm">
                To install this app on your iOS device, tap the share button
                <span role="img" aria-label="share icon">
                  {" "}
                  ⎋{" "}
                </span>
                and then &quot;Add to Home Screen&quot;
                <span
                  role="img"
                  aria-label="plus icon"
                  onClick={handleInstallClick}
                >
                  {" "}
                  ➕{" "}
                </span>
                .
              </p>
            )}
            {/* isDesktop && installEvent && */}
            {isDesktop && (
              <div className="flex items-center justify-between p-0 m-0">
                <p className="text-xs sm:text-sm">
                  Click the install button below to install this app on your
                  desktop.
                </p>
                <button
                  onClick={handleInstallClick}
                  className="bg-blue-600 text-white text-sm p-2 px-4 rounded"
                >
                  Install App
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
