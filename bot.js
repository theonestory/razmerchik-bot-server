const { Telegraf, Markup } = require('telegraf');
const http = require('http');

// --- 1. ГЛОБАЛЬНАЯ ЗАЩИТА ОТ ПАДЕНИЙ ---
// Эти строки не дадут серверу "умереть", если случится непредвиденная ошибка
process.on('uncaughtException', (err) => {
  console.error('❌ КРИТИЧЕСКАЯ ОШИБКА:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ НЕОБРАБОТАННОЕ ОТКЛОНЕНИЕ:', reason);
});

// --- 2. МГНОВЕННЫЙ ЗАПУСК СЕРВЕРА ДЛЯ RENDER ---
const PORT = process.env.PORT || 10000;
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is alive!');
});

server.listen(PORT, () => {
  console.log(`>>> Мониторинг запущен на порту ${PORT}`);
});

// --- 3. ИНИЦИАЛИЗАЦИЯ БОТА ---
const bot = new Telegraf(process.env.BOT_TOKEN);
const MINI_APP_URL = 'https://theonestory.github.io/razmerchik/';

// Ловим ошибки внутри самого бота (например, если Telegram временно недоступен)
bot.catch((err, ctx) => {
  console.log(`⚠️ Ошибка Telegraf для ${ctx.updateType}:`, err.message);
});

// --- 4. КОМАНДЫ БОТА ---

// Команда /start
bot.start((ctx) => {
  return ctx.reply(
    'Привет! 📏\n\nЯ помогу тебе подобрать идеальный размер одежды и обуви.\n\nНажимай кнопку ниже, чтобы запустить помощника:',
    Markup.inlineKeyboard([
      [Markup.button.webApp('🚀 Запустить Размерчик', MINI_APP_URL)]
    ])
  );
});

// Твоя команда /about
bot.command('about', (ctx) => {
  ctx.reply(
    '🛠️ О проекте «Размерчик»\n\n' +
    'Это тестовый учебный проект, поэтому команда /start может иногда срабатывать не сразу (бесплатному серверу нужно время на «прогрев»). \n\n' +
    'Если кнопка запуска не реагирует, проще всего запустить Mini App напрямую через кнопку в меню бота.\n\n' +
    'Увы, связка render.com + cron-job.org + github на бесплатном тарифе не всегда работает идеально. Понять и простить. 🙏'
  );
});

// --- 5. УМНЫЙ ЗАПУСК ---
bot.launch()
  .then(() => {
    console.log('//////////////////////////////////////////');
    console.log('Бот запущен и готов к работе!');
    console.log('//////////////////////////////////////////');
  })
  .catch((err) => {
    if (err.response && err.response.error_code === 409) {
      console.log('>>> Конфликт (409): Старая версия еще активна. Ждем ротации...');
    } else {
      console.error('>>> Ошибка запуска:', err);
    }
  });

// Корректная остановка при перезагрузке сервера
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
