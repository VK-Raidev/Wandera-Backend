const assert = require('node:assert/strict')
const { once } = require('node:events')
const express = require('express')
const { afterEach, test } = require('node:test')
const { createAccountLoginRateLimit } = require('../src/middleware/authRateLimit')

const servers = new Set()

afterEach(async () => {
  await Promise.all([...servers].map(async (server) => {
    server.closeAllConnections()
    server.close()
    await once(server, 'close')
  }))
  servers.clear()
})

async function startLoginServer(rateLimit) {
  const app = express()
  app.use(express.json())
  app.post('/login', rateLimit, (request, response) => {
    response.status(request.body.password === 'correct' ? 200 : 401).json({ ok: request.body.password === 'correct' })
  })

  const server = app.listen(0, '127.0.0.1')
  servers.add(server)
  await once(server, 'listening')
  return `http://127.0.0.1:${server.address().port}/login`
}

async function attemptLogin(url, email, password = 'wrong') {
  return fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

test('limits failed sign-ins per normalized account without blocking another account', async () => {
  const url = await startLoginServer(createAccountLoginRateLimit())

  for (let attempt = 0; attempt < 15; attempt += 1) {
    const email = attempt % 2 === 0 ? 'traveler@example.com' : 'TRAVELER@example.com'
    assert.equal((await attemptLogin(url, email)).status, 401)
  }
  assert.equal((await attemptLogin(url, 'traveler@example.com')).status, 429)
  assert.equal((await attemptLogin(url, 'another@example.com')).status, 401)
})

test('successful sign-ins do not consume the failed-attempt allowance', async () => {
  const url = await startLoginServer(createAccountLoginRateLimit())

  for (let attempt = 0; attempt < 20; attempt += 1) {
    assert.equal((await attemptLogin(url, 'traveler@example.com', 'correct')).status, 200)
  }
  for (let attempt = 0; attempt < 15; attempt += 1) {
    assert.equal((await attemptLogin(url, 'traveler@example.com')).status, 401)
  }
  assert.equal((await attemptLogin(url, 'traveler@example.com')).status, 429)
})

test('failed sign-in lockout expires after its configured window', async () => {
  const url = await startLoginServer(createAccountLoginRateLimit({ limit: 1, windowMs: 100 }))

  assert.equal((await attemptLogin(url, 'traveler@example.com')).status, 401)
  assert.equal((await attemptLogin(url, 'traveler@example.com')).status, 429)
  await new Promise((resolve) => setTimeout(resolve, 125))
  assert.equal((await attemptLogin(url, 'traveler@example.com')).status, 401)
})
