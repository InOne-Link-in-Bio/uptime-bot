# Uptime Monitoring Telegram Bot

A Telegram bot that monitors a specified URL and sends notifications to configured chat IDs when the endpoint is not responding or returns a non-200 status code.

## Features

- Monitors a specified URL at configurable intervals
- Sends notifications to multiple Telegram chats
- Configurable request timeout
- Docker and Docker Compose support
- Built with TypeScript and grammY

## Setup

1. Clone the repository
2. Configure your environment variables in `docker-compose.yml`:
   - `BOT_TOKEN`: Your Telegram bot token from [@BotFather](https://t.me/BotFather)
   - `MONITOR_URL`: The URL to monitor
   - `NOTIFICATION_CHAT_IDS`: Comma-separated list of Telegram chat IDs to notify
   - `CHECK_INTERVAL`: Interval between checks in seconds (default: 60)
   - `REQUEST_TIMEOUT`: Request timeout in milliseconds (default: 5000)

## Running with Docker Compose

1. Build and start the container:
   ```bash
   docker-compose up -d
   ```

2. View logs:
   ```bash
   docker-compose logs -f
   ```

3. Stop the bot:
   ```bash
   docker-compose down
   ```

## Development

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start in development mode:
   ```bash
   pnpm dev
   ```

3. Build for production:
   ```bash
   pnpm build
   ```

4. Start in production mode:
   ```bash
   pnpm start
   ```

## License

MIT