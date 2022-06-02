/* global posthog */
/* eslint no-undef: "error" */

import fetch from 'node-fetch'

export async function setupPlugin(meta) {
    runEveryMinute(meta)
}

export async function runEveryMinute({ config }) {
    const timestamp = new Date().toISOString()
    const capturePromises = [captureHeartbeat(timestamp)]
    if (config.events.includes('heartbeat_api')) {
        capturePromises.push(captureHeartbeatApi(timestamp, config.host, config.project_api_key))
    }
    await Promise.all(capturePromises)
    console.log(`Captured: ${capturePromises.length}`)
}

/** Capture `heartbeat` event, directly into the queue */
async function captureHeartbeat(timestamp: string) {
    await posthog.capture('heartbeat', { $timestamp: timestamp })
}

/** Capture `heartbeat_api` event, via the API */
async function captureHeartbeatApi(timestamp: string, host: string, projectApiKey: string) {
    const response = await fetch(`${host}/e`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: projectApiKey,
            event: 'heartbeat_api',
            distinct_id: 'PostHog Heartbeat Plugin',
            properties: { $timestamp: timestamp },
        }),
    })
    console.debug(await response.json())
}
