

const getMsFromMinutes = minutes => minutes * 60 * 1000;

//todo возможность задавать кастомные фазы из клиента
let phases = [
  //1
  { duration: 25, messages: ['За работу!!!!'] },
  { duration: 5, messages: ['Через пять минут отдыхать! Приготовься!!!'] },
  { duration: 5, messages: ['Пора Отдыхать, друзья', "Работа не волк, Работа это ворк! Отдыхайте 5 минут", "Бросайте свои дела и кайфуйте"] },

  { duration: 25, messages: ['За работу!!!!'] },
  { duration: 5, messages: ['Через пять минут отдыхать! Приготовься!!!'] },
  { duration: 5, messages: ['Пора Отдыхать, друзья'] },

  { duration: 25, messages: ['За работу!!!!'] },
  { duration: 5, messages: ['Через пять минут отдыхать! Приготовься!!!'] },
  { duration: 5, messages: ['Пора Отдыхать, друзья'] },

  { duration: 25, messages: ['За работу!!!!'] },
  { duration: 5, messages: ['Через пять минут отдыхать! Приготовься!!!'] },
  { duration: 20, messages: ['Пора Отдыхать, друзья'] },

  //2
  { duration: 25, messages: ['За работу!!!!'] },
  { duration: 5, messages: ['Через пять минут отдыхать! Приготовься!!!'] },
  { duration: 5, messages: ['Пора +Отдыхать, друзья', "Работа не волк, Работа это ворк! Отдыхайте 5 минут", "Бросайте свои дела и кайфуйте"] },

  { duration: 25, messages: ['За работу!!!!'] },
  { duration: 5, messages: ['Через пять минут отдыхать! Приготовься!!!'] },
  { duration: 5, messages: ['Пора Отдыхать, друзья'] },

  { duration: 25, messages: ['За работу!!!!'] },
  { duration: 5, messages: ['Через пять минут отдыхать! Приготовься!!!'] },
  { duration: 5, messages: ['Пора Отдыхать, друзья'] },

  { duration: 15, messages: ['За работу!!!!'] },
  { duration: 15, messages: ['Рабочий день скоро кончится, заканчивайте!'] },
  { duration: 0, messages: ['Рабочий день окончен!'] },
]

exports.getWorkingTimer = () => {
  let timer, currentPhaseIndex, interval, sendNotifications;

  const drop = () => {
    timer = 0
    currentPhaseIndex = 0;
    clearInterval(interval);
    interval = null;
  }

  const updateTimer = () => {
    timer = getMsFromMinutes(phases[currentPhaseIndex].duration);
  }

  const play = () => {
    if (interval) return;

    interval = setInterval(() => {
      timer -= 1000;

      if (timer <= 0) {
        if (currentPhaseIndex - 1 < phases.length) {
          currentPhaseIndex++;
          updateTimer();
        }
        sendNotifications(phases[currentPhaseIndex].messages[0]) //туду выбор рандомного мессаджа
      }
    }, 1000)
  }

  const pause = () => {
    clearInterval(interval);
    interval = null;
  }

  const start = (_sendNotifications) => {
    if (interval) return;
    sendNotifications = _sendNotifications;

    drop();

    updateTimer();

    play();
  }

  const stop = () => {
    drop();
  }

  getRemaining = () => {
    const remainingPhases = phases.slice(currentPhaseIndex + 1)
    const progressPhases = phases.slice(0, currentPhaseIndex + 1)
    const totalRemain = (getMsFromMinutes(remainingPhases.reduce((r, c) => r += c.duration, 0)) + timer) / 1 / 60;
    const totalProgress = (getMsFromMinutes(progressPhases.reduce((r, c) => r += c.duration, 0)) - timer) / 1 / 60;
    return {
      totalRemain,
      totalProgress,
      progress: totalProgress / totalRemain * 100,

      remainCounts: phases.length - currentPhaseIndex,
    }
  }

  return {
    start, stop, pause, play, getRemaining
  }
}