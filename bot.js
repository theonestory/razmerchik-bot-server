const { Telegraf, Markup } = require('telegraf');
const http = require('http');

// Этот блок нужен, чтобы бесплатный сервер Render не отключал бота
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is alive!');
}).listen(process.env.PORT || 8080);

// ТОКЕН ОТ BOTFATHER
const bot = new Telegraf('8625745881:AAHmkcYuMu_9B0HrP-KTJEeJx2PEqdPa28M');

// ССЫЛКА НА ТВОЙ МИНИ-АПП (GitHub Pages)
const MINI_APP_URL = 'https://theonestory.github.io/razmerchik/';

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

bot.launch();

// Обработка мягкой остановки
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
