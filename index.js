/* global posthog */
/* eslint no-undef: "error" */

export async function runEveryMinute() {
    await captureHeartbeat()
}

// Capture event called heartbeat
async function captureHeartbeat() {
    await posthog.capture('heartbeat', {timestamp_iso:new Date().toISOString()})
}
