/* global posthog */
/* eslint no-undef: "error" */

export async function runEveryMinute() {
    await captureHeartbeat()
}

export async function setupPlugin() {
    await captureHeartbeat()
}

// Capture event called heartbeat
async function captureHeartbeat() {
    await posthog.capture('heartbeat', {timestamp:Date.now()})
}
