const { Telegraf, Markup } = require('telegraf');
const http = require('http');

// 1. Создаем мини-сервер для Render (чтобы он видел активность и не отключал проект)
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is alive!');
}).listen(process.env.PORT || 10000); // Render обычно использует порт 10000

// 2. Инициализация бота (токен берется из настроек Environment на Render)
const bot = new Telegraf(process.env.BOT_TOKEN);

const MINI_APP_URL = 'https://theonestory.github.io/razmerchik/';

// 3. Команда /start
bot.start((ctx) => {
  return ctx.reply(
    'Привет! 📏\n\nЯ помогу тебе подобрать идеальный размер одежды и обуви.\n\nНажимай кнопку ниже, чтобы запустить помощника:',
    Markup.inlineKeyboard([
      [
        Markup.button.webApp('🚀 Запустить Размерчик', MINI_APP_URL)
      ]
    ])
  );
});

// 4. Новая команда /about (Информация о проекте)
bot.command('about', (ctx) => {
  ctx.reply(
    '🛠️ О проекте «Размерчик»\n\n' +
    'Это тестовый учебный проект, поэтому команда /start может иногда срабатывать не сразу (бесплатному серверу нужно время на «прогрев»). \n\n' +
    'Если кнопка запуска не реагирует, проще всего запустить Mini App напрямую через кнопку в меню бота.\n\n' +
    'Увы, связка render.com + cron-job.org + github на бесплатном тарифе не всегда работает идеально. Понять и простить. 🙏'
  );
});

// 5. Запуск бота
bot.launch().then(() => {
  console.log('//////////////////////////////////////////');
  console.log('Бот запущен успешно!');
  console.log('//////////////////////////////////////////');
});

// Обработка корректной остановки
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
 
