"use client";

import { SerwistProvider } from "@serwist/turbopack/react";
import {
  useEffect,
  type ReactNode,
} from "react";

interface PwaProviderProps {
  children: ReactNode;
  enabled: boolean;
}

function OfflineNavigationGuard() {
  useEffect(() => {
    function handleOfflineNavigation(
      event: MouseEvent,
    ) {
      if (
        navigator.onLine ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a[href]");

      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (
        anchor.download ||
        (anchor.target && anchor.target !== "_self")
      ) {
        return;
      }

      const url = new URL(
        anchor.href,
        window.location.href,
      );

      if (url.origin !== window.location.origin) {
        return;
      }

      const sameDocumentHash =
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        Boolean(url.hash);

      if (sameDocumentHash) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      window.location.assign(url.href);
    }

    document.addEventListener(
      "click",
      handleOfflineNavigation,
      true,
    );

    return () => {
      document.removeEventListener(
        "click",
        handleOfflineNavigation,
        true,
      );
    };
  }, []);

  return null;
}

export default function PwaProvider({
  children,
  enabled,
}: PwaProviderProps) {
  useEffect(() => {
    if (enabled || !('serviceWorker' in navigator)) return;
    void navigator.serviceWorker.getRegistrations().then(registrations => Promise.all(registrations.filter(registration => [registration.active, registration.waiting, registration.installing].some(worker => worker && new URL(worker.scriptURL).pathname === '/serwist/sw.js')).map(registration => registration.unregister())));
    void caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('bittup-public-v2-') || key.startsWith('upnode-pwa-')).map(key => caches.delete(key))));
    localStorage.removeItem('upnode-offline-presentation-ready');
  }, [enabled]);
  if (!enabled) {
    return children;
  }

  return (
    <SerwistProvider swUrl="/serwist/sw.js">
      <OfflineNavigationGuard />

      {children}
    </SerwistProvider>
  );
}