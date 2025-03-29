"use client";

import { useEffect, useState } from "react";
import {
  subscribeUser,
  unsubscribeUser,
  sendNotification,
} from "@/app/actions";

const SettingsPage = () => {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [isSupported, setIsSupported] = useState(false);

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

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
      console.log("notify");
      await sendNotification(message);
      setMessage("");
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }
  return (
    <div className="w-full h-screen flex items-center justify-center">
      {subscription ? (
        <div className="shadow max-w-xl p-4 rounded flex flex-col items-center space-y-2">
          <p>You are subscribed to push notifications.</p>
          <button
            onClick={unsubscribeFromPush}
            className="shadow px-4 py-1 rounded bg-gray-300 ml-auto text-sm"
          >
            Unsubscribe
          </button>
          <input
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border w-full h-10 px-1 rounded text-sm"
          />
          <button
            onClick={sendTestNotification}
            className="shadow px-4 py-1 rounded-full bg-blue-600 w-full text-sm text-white cursor-pointer"
          >
            Send Test
          </button>
        </div>
      ) : (
        <div className="shadow max-w-xl p-4 rounded flex flex-col items-center space-y-2">
          <p>You are not subscribed to push notifications.</p>
          <button
            onClick={subscribeToPush}
            className="shadow px-4 py-1 rounded-full bg-gray-300 cursor-pointer"
          >
            Subscribe
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
