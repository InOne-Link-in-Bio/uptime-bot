import { Bot } from "grammy";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

// Environment variables validation
const requiredEnvVars = ["BOT_TOKEN", "MONITOR_URL", "NOTIFICATION_CHAT_IDS"];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

const bot = new Bot(process.env.BOT_TOKEN!);
const monitorUrl = process.env.MONITOR_URL!;
const chatIds = process.env.NOTIFICATION_CHAT_IDS!.split(",");
// Convert seconds to milliseconds for internal use
const checkIntervalSeconds = parseInt(process.env.CHECK_INTERVAL || "60", 10);
const checkIntervalMs = checkIntervalSeconds * 1000;
const requestTimeout = parseInt(process.env.REQUEST_TIMEOUT || "5000", 10);

// Initialize bot
bot.command("start", async (ctx) => {
    await ctx.reply("Uptime monitoring bot is running! 🤖");
});

// Monitor function
async function checkEndpoint(): Promise<void> {
    try {
        await axios.get(monitorUrl, {
            timeout: requestTimeout,
        });
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        const notificationMessage = `⚠️ Alert: ${monitorUrl} is not responding!\nError: ${errorMessage}`;

        // Send notification to all configured chat IDs
        for (const chatId of chatIds) {
            try {
                await bot.api.sendMessage(chatId, notificationMessage);
            } catch (sendError) {
                console.error(
                    `Failed to send message to chat ${chatId}:`,
                    sendError,
                );
            }
        }
    }
}

// Start monitoring
async function startMonitoring(): Promise<void> {
    const monitoringMessage =
        "Starting uptime monitoring...\n" +
        `Monitoring URL: ${monitorUrl}\n` +
        `Check interval: ${checkIntervalSeconds} seconds\n` +
        `Request timeout: ${requestTimeout}ms\n` +
        `Notification chat IDs: ${chatIds.join(", ")}`;
    console.log(monitoringMessage);
    for (const chatId of chatIds) {
        await bot.api.sendMessage(chatId, monitoringMessage);
    }

    // Initial check
    await checkEndpoint();

    // Set up periodic checks
    setInterval(checkEndpoint, checkIntervalMs);
}

// Start the bot and monitoring
async function main(): Promise<void> {
    try {
        await Promise.all([bot.start(), startMonitoring()]);
    } catch (error) {
        console.error("Failed to start the bot:", error);
        process.exit(1);
    }
}

main();
