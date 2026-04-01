const { Telegraf, Markup } = require('telegraf');
const http = require('http');

// 1. МГНОВЕННЫЙ ЗАПУСК СЕРВЕРА (Порт для Render)
// Это самое важное: мы говорим Render "я живой" сразу, не дожидаясь ответа от Telegram
const PORT = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is alive!');
}).listen(PORT, () => {
  console.log(`>>> Мониторинг запущен на порту ${PORT}`);
});

// 2. ИНИЦИАЛИЗАЦИЯ
const bot = new Telegraf(process.env.BOT_TOKEN);
const MINI_APP_URL = 'https://theonestory.github.io/razmerchik/';

// 3. ЗАЩИТА ОТ ПАДЕНИЙ (Global Error Handler)
// Если случится ошибка (например, конфликт 409), бот просто напишет об этом в лог, но НЕ ВЫКЛЮЧИТСЯ
bot.catch((err, ctx) => {
  console.log(`⚠️ Ошибка Telegraf для ${ctx.updateType}:`, err.message);
});

// 4. КОМАНДЫ
bot.start((ctx) => {
  return ctx.reply(
    'Привет! 📏\n\nЯ помогу тебе подобрать идеальный размер одежды и обуви.\n\nНажимай кнопку ниже, чтобы запустить помощника:',
    Markup.inlineKeyboard([
      [Markup.button.webApp('🚀 Запустить Размерчик', MINI_APP_URL)]
    ])
  );
});

bot.command('about', (ctx) => {
  ctx.reply(
    '🛠️ О проекте «Размерчик»\n\n' +
    'Это тестовый учебный проект. Если бот молчит, подождите 30 секунд — сервер просыпается.\n\n' +
    'Связка Render + Cron-job + GitHub на бесплатном тарифе требует терпения. Понять и простить. 🙏'
  );
});

// 5. УМНЫЙ ЗАПУСК
// Добавляем .catch, чтобы при конфликте деплой не помечался как "Failed"
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

// Корректная остановка
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
