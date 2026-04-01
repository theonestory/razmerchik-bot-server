const { Telegraf, Markup } = require('telegraf');
const http = require('http');

// 1. Глобальная защита
process.on('uncaughtException', (err) => console.error('❌ Ошибка:', err));
process.on('unhandledRejection', (err) => console.error('❌ Отклонение:', err));

// 2. HTTP сервер для Render (всегда онлайн)
const PORT = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is alive!');
}).listen(PORT, () => console.log(`>>> Мониторинг на порту ${PORT}`));

// 3. Настройка бота
const bot = new Telegraf(process.env.BOT_TOKEN);
const MINI_APP_URL = 'https://theonestory.github.io/razmerchik/';

bot.catch((err) => console.log('⚠️ Ошибка Telegraf:', err.message));

bot.start((ctx) => {
  return ctx.reply(
    'Привет! 📏\n\nЯ помогу тебе подобрать идеальный размер одежды и обуви.\n\nНажимай кнопку ниже:',
    Markup.inlineKeyboard([[Markup.button.webApp('🚀 Запустить Размерчик', MINI_APP_URL)]])
  );
});

bot.command('about', (ctx) => {
  ctx.reply(
    '🛠️ О проекте «Размерчик»\n\n' +
    'Это тестовый учебный проект. Если бот молчит, подождите 30 секунд.\n\n' +
    'Связка Render + Cron-job + GitHub требует терпения. Понять и простить. 🙏',
    { parse_mode: 'Markdown' } // Добавил, чтобы текст был красивым и жирным
  );
});

// 4. ФУНКЦИЯ "ВЕЧНОГО" ЗАПУСКА (Исправляет проблему молчания)
function launchBot() {
  console.log('>>> Попытка подключения к Telegram...');
  bot.launch()
    .then(() => {
      console.log('//////////////////////////////////////////');
      console.log('✅ ПОБЕДА: Бот подключен и слушает команды!');
      console.log('//////////////////////////////////////////');
    })
    .catch((err) => {
      if (err.response && err.response.error_code === 409) {
        console.log('⚠️ Конфликт 409. Telegram еще держит старую версию. Пробую снова через 10 секунд...');
        setTimeout(launchBot, 10000); // Пытаемся снова через 10 сек
      } else {
        console.error('❌ Ошибка запуска, пробую через 20 сек:', err.message);
        setTimeout(launchBot, 20000);
      }
    });
}

launchBot(); // Запускаем цикл

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
