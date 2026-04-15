/**
 * Setup Telegram Webhook
 *
 * Registers your deployed URL as the Telegram Bot webhook.
 *
 * Usage:
 *   TELEGRAM_BOT_TOKEN=xxx WEBHOOK_URL=https://yourdomain.com npx ts-node scripts/setup-telegram-webhook.ts
 *
 * Or set both in .env.local and run:
 *   npx ts-node -r dotenv/config scripts/setup-telegram-webhook.ts
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL || process.env.NEXTAUTH_URL;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN is required');
  process.exit(1);
}

if (!WEBHOOK_URL) {
  console.error('❌ WEBHOOK_URL (or NEXTAUTH_URL) is required');
  process.exit(1);
}

const webhookEndpoint = `${WEBHOOK_URL.replace(/\/$/, '')}/api/bot/telegram`;

async function setWebhook() {
  console.log(`🔗 Setting webhook to: ${webhookEndpoint}`);

  const body: Record<string, string> = {
    url: webhookEndpoint,
    allowed_updates: JSON.stringify(['message', 'edited_message']),
  };

  if (WEBHOOK_SECRET) {
    body.secret_token = WEBHOOK_SECRET;
    console.log('🔒 Webhook secret token configured');
  }

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json() as { ok: boolean; description?: string };

  if (data.ok) {
    console.log('✅ Webhook set successfully!');
  } else {
    console.error('❌ Failed to set webhook:', data.description);
    process.exit(1);
  }
}

async function getWebhookInfo() {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
  const data = await res.json() as { ok: boolean; result?: Record<string, unknown> };
  if (data.ok) {
    console.log('\n📋 Current webhook info:');
    console.log(JSON.stringify(data.result, null, 2));
  }
}

async function setBotCommands() {
  const commands = [
    { command: 'start', description: 'Welcome message & overview' },
    { command: 'help', description: 'Show available commands' },
    { command: 'essentials', description: 'Payments, SIM card & VPN tips' },
    { command: 'hotels', description: 'Find hotels in major cities' },
    { command: 'food', description: 'Chinese food guide' },
    { command: 'timeline', description: 'Your 6-step landing checklist' },
    { command: 'emergency', description: 'Emergency numbers in China' },
  ];

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commands }),
  });

  const data = await res.json() as { ok: boolean; description?: string };
  if (data.ok) {
    console.log('✅ Bot commands registered!');
  } else {
    console.warn('⚠️  Failed to set commands:', data.description);
  }
}

(async () => {
  await setWebhook();
  await setBotCommands();
  await getWebhookInfo();
})();
