/* global posthog */
/* eslint no-undef: "error" */

import fetch from 'node-fetch'

export async function runEveryMinute({ config }) {
    const timestamp = new Date().toISOString()
    const eventsArray = config.events.split(' + ')
    const capturePromises = []
    if (eventsArray.includes('heartbeat')) {
        capturePromises.push(captureHeartbeat(timestamp))
    }
    if (eventsArray.includes('heartbeat_api')) {
        capturePromises.push(captureHeartbeatApi(timestamp, config.host, config.project_api_key))
    }
    await Promise.all(capturePromises)
    console.info(`Sent ${config.events} at ${timestamp}`)
}

/** Capture `heartbeat` event, directly into the queue */
async function captureHeartbeat(timestamp: string) {
    await posthog.capture('heartbeat', { $timestamp: timestamp })
}

/** Capture `heartbeat_api` event, via the API */
async function captureHeartbeatApi(timestamp: string, host: string, projectApiKey: string) {
    await fetch(`${host}/e`, {
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
}
