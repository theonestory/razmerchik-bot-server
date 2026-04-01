const { Telegraf, Markup } = require('telegraf');
const http = require('http');

// 1. Глобальная защита от падений
process.on('uncaughtException', (err) => console.error('❌ Ошибка:', err));
process.on('unhandledRejection', (err) => console.error('❌ Отклонение:', err));

// 2. HTTP сервер для Render (чтобы сервис не засыпал и деплой проходил успешно)
const PORT = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is alive!');
}).listen(PORT, () => console.log(`>>> Мониторинг на порту ${PORT}`));

// 3. Настройка бота
const bot = new Telegraf(process.env.BOT_TOKEN);
const MINI_APP_URL = 'https://theonestory.github.io/razmerchik/';

bot.catch((err) => console.log('⚠️ Ошибка Telegraf:', err.message));

// Команда /start
bot.start((ctx) => {
  return ctx.reply(
    'Привет! 📏\n\nЯ помогу тебе подобрать идеальный размер одежды и обуви.\n\nНажимай кнопку ниже:',
    Markup.inlineKeyboard([[Markup.button.webApp('🚀 Запустить Размерчик', MINI_APP_URL)]])
  );
});

// ОБНОВЛЕННАЯ КОМАНДА /about (с твоим текстом)
bot.command('about', (ctx) => {
  ctx.reply(
    '🛠️ О проекте «Размерчик»\n\n' +
    'Это тестовый учебный проект, поэтому команда /start может иногда срабатывать не сразу (бесплатному серверу нужно время на «прогрев»). \n\n' +
    'Если кнопка запуска не реагирует, проще всего запустить Mini App напрямую через кнопку в меню бота.\n\n' +
    'Увы, связка render.com + cron-job.org + github на бесплатном тарифе не всегда работает идеально. Понять и простить. 🙏'
  );
});

// 4. Функция "вечного" запуска (автоматически пробует заново при конфликтах 409)
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
        setTimeout(launchBot, 10000); 
      } else {
        console.error('❌ Ошибка запуска, пробую через 20 сек:', err.message);
        setTimeout(launchBot, 20000);
      }
    });
}

launchBot(); 

// Корректная остановка
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
