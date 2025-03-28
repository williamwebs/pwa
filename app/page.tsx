"use client";

import { useState, useEffect } from "react";
import { subscribeUser, unsubscribeUser, sendNotification } from "./actions";
import { GoHome, GoSearch } from "react-icons/go";
import Link from "next/link";
import { CiShoppingCart, CiUser } from "react-icons/ci";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });
    setSubscription(sub);
    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(serializedSub);
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message);
      setMessage("");
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  return (
    <div className="border">
      <h3>Push Notifications</h3>
      {subscription ? (
        <>
          <p>You are subscribed to push notifications.</p>
          <button
            onClick={unsubscribeFromPush}
            className="shadow px-4 py-1 rounded-full bg-gray-300"
          >
            Unsubscribe
          </button>
          <input
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={sendTestNotification}
            className="shadow px-4 py-1 rounded-full bg-gray-300"
          >
            Send Test
          </button>
        </>
      ) : (
        <>
          <p>You are not subscribed to push notifications.</p>
          <button
            onClick={subscribeToPush}
            className="shadow px-4 py-1 rounded-full bg-gray-300"
          >
            Subscribe
          </button>
        </>
      )}
    </div>
  );
}

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );

    // Detect Android
    setIsAndroid(/Android/.test(navigator.userAgent));

    // Detect Desktop
    setIsDesktop(!isIOS && !isAndroid);

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    // Listen for install prompt (only on Android & Desktop)
    window.addEventListener("beforeinstallprompt", (e: any) => {
      e.preventDefault();
      setInstallEvent(e);
    });
  }, []);

  if (isStandalone) {
    return null; // Don't show install button if already installed
  }

  const handleInstallClick = () => {
    if (installEvent) {
      installEvent.prompt();
    } else {
      console.error("No install event available");
    }
  };

  return (
    <div className="border">
      {/* <h3>Install App</h3>
      <button
        onClick={handleInstallClick}
        className="shadow px-4 py-1 rounded-full bg-gray-300"
      >
        Add to Home Screen
      </button> */}
      {isAndroid && (
        <>
          <p>
            Click the install button below to install this app on your android
            device.
          </p>
          <button
            onClick={handleInstallClick}
            className="mt-2 bg-blue-600 text-white p-2 rounded"
          >
            Install App
          </button>
        </>
      )}

      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon">
            {" "}
            ⎋{" "}
          </span>
          and then "Add to Home Screen"
          <span role="img" aria-label="plus icon">
            {" "}
            ➕{" "}
          </span>
          .
        </p>
      )}

      {isDesktop && installEvent && (
        <>
          <p>
            Click the install button below to install this app on your desktop.
          </p>
          <button
            onClick={handleInstallClick}
            className="mt-2 bg-blue-600 text-white p-2 rounded"
          >
            Install App
          </button>
        </>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <div className="relative w-screen h-screen">
      <main className="border w-full h-full p-4 pb-10 bg-red-200">
        <PushNotificationManager />
        <InstallPrompt />
      </main>

      {/* absolute tab nav on mobile */}
      <div className="absolute bottom-0 left-0 shadow-lg bg-white w-full px-4 py-4 rounded-t-xl flex items-center justify-around">
        <Link href={"/"} className="">
          <GoHome className="size-6" />
        </Link>
        <Link href={"/"} className="">
          <GoSearch className="size-6" />
        </Link>
        <Link href={"/"} className="">
          <CiShoppingCart className="size-6" />
        </Link>
        <Link href={"/"} className="">
          <CiUser className="size-6" />
        </Link>
      </div>
    </div>
  );
}
