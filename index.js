const TelegramBot = require('node-telegram-bot-api');
const { getWorkingTimer } = require('./workingTimer.js');
const { token } = require('./secrets.js')

const bot = new TelegramBot(token, { polling: true });

const defaultKeyboard = {
  "reply_markup": {
    "keyboard": [
      [
        "Старт", "Стоп", "Пауза", "Продолжить", "Остаток"
      ]
    ]
  }
}

let rooms = {};

const getTimerByUserId = (id) => {
  return rooms[id];
}

const sendMessage = (id, msg, keyboard = defaultKeyboard) => {
  bot.sendMessage(id, msg, keyboard);
}

bot.onText(/(Старт)|(\/start)/, (msg) => {
  const id = msg.chat.id || msg.from.id;

  rooms[id] = getWorkingTimer();

  getTimerByUserId(id).start((m) => bot.sendMessage(id, m, defaultKeyboard));

});

bot.onText(/Стоп/, ({ from: { id } }) => {
  getTimerByUserId(id).stop();
  sendMessage(id, 'Остановился');
});

bot.onText(/Пауза/, ({ from: { id } }) => {
  getTimerByUserId(id).pause();
  sendMessage(id, 'Подождем-с');
});

bot.onText(/Продолжить/, ({ from: { id } }) => {
  getTimerByUserId(id).play();
  sendMessage(id, 'Продолжаем воркать!!');
});

bot.onText(/Остаток/, ({ from: { id } }) => {
  const remain = getTimerByUserId(id).getRemaining();
  sendMessage(id, JSON.stringify(remain));
});