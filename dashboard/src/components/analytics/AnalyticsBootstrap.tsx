"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const GOOGLE_ANALYTICS_MEASUREMENT_ID = "G-C80FYVWM7Q";
const MICROSOFT_CLARITY_PROJECT_ID = "gsmtsb2x58";
// Fill this with the value from data-cf-beacon token in Cloudflare Web Analytics.
const CLOUDFLARE_BEACON_TOKEN = "71b526d0a7304738a18997c126b919a0";

declare global {
	interface ClarityFn {
		(...args: unknown[]): void;
		q?: unknown[][];
	}

	interface Window {
		dataLayer?: unknown[];
		gtag?: (...args: unknown[]) => void;
		clarity?: ClarityFn;
		__analyticsGaInitialized?: boolean;
		__analyticsClarityInitialized?: boolean;
		__analyticsCloudflareInitialized?: boolean;
	}
}

const GA_SCRIPT_ID = "ga4-script";
const CLARITY_SCRIPT_ID = "clarity-script";
const CLOUDFLARE_SCRIPT_ID = "cloudflare-beacon-script";

const injectScript = (id: string, src: string, attrs: Record<string, string> = {}) => {
	if (document.getElementById(id)) return;

	const script = document.createElement("script");
	script.id = id;
	script.src = src;
	script.async = true;

	Object.entries(attrs).forEach(([key, value]) => {
		script.setAttribute(key, value);
	});

	document.head.appendChild(script);
};

const initGoogleAnalytics = (measurementId: string) => {
	if (window.__analyticsGaInitialized) return;

	injectScript(GA_SCRIPT_ID, `https://www.googletagmanager.com/gtag/js?id=${measurementId}`);

	window.dataLayer = window.dataLayer || [];

	const gtag = (...args: unknown[]) => {
		window.dataLayer?.push(args);
	};

	window.gtag = gtag;

	gtag("js", new Date());
	gtag("config", measurementId, { send_page_view: false });

	window.__analyticsGaInitialized = true;
};

const initClarity = (projectId: string) => {
	if (window.__analyticsClarityInitialized || document.getElementById(CLARITY_SCRIPT_ID)) return;

	window.clarity =
		window.clarity ||
		((...args: unknown[]) => {
			window.clarity?.q = window.clarity?.q || [];
			window.clarity?.q?.push(args);
		});

	const script = document.createElement("script");
	script.id = CLARITY_SCRIPT_ID;
	script.async = true;
	script.src = `https://www.clarity.ms/tag/${projectId}`;

	document.head.appendChild(script);

	window.__analyticsClarityInitialized = true;
};

const initCloudflareAnalytics = (token: string) => {
	if (window.__analyticsCloudflareInitialized) return;

	injectScript(CLOUDFLARE_SCRIPT_ID, "https://static.cloudflareinsights.com/beacon.min.js", {
		defer: "true",
		"data-cf-beacon": JSON.stringify({ token }),
	});

	window.__analyticsCloudflareInitialized = true;
};

const trackPageView = (measurementId: string, pagePath: string) => {
	if (!window.gtag) return;

	window.gtag("event", "page_view", {
		send_to: measurementId,
		page_path: pagePath,
		page_location: window.location.href,
	});
};

export default function AnalyticsBootstrap() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const pagePath = useMemo(() => {
		const query = searchParams.toString();
		return query ? `${pathname}?${query}` : pathname;
	}, [pathname, searchParams]);

	useEffect(() => {
		if (GOOGLE_ANALYTICS_MEASUREMENT_ID) {
			initGoogleAnalytics(GOOGLE_ANALYTICS_MEASUREMENT_ID);
		}

		if (MICROSOFT_CLARITY_PROJECT_ID) {
			initClarity(MICROSOFT_CLARITY_PROJECT_ID);
		}

		if (CLOUDFLARE_BEACON_TOKEN) {
			initCloudflareAnalytics(CLOUDFLARE_BEACON_TOKEN);
		}
	}, []);

	useEffect(() => {
		if (!GOOGLE_ANALYTICS_MEASUREMENT_ID || !window.__analyticsGaInitialized) return;
		trackPageView(GOOGLE_ANALYTICS_MEASUREMENT_ID, pagePath);
	}, [pagePath]);

	return null;
}
