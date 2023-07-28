const deleteButton = { text: "Удалить", callback_data: "delete_tranz" };

const deleteKeyboard = {
  method: "post",
  contentType: "application/json",
  payload: JSON.stringify({
    reply_markup: { inline_keyboard: [[deleteButton]] },
  }),
};

const monthNumbers = { "Янв": 1, "Фев": 2, "Мар": 3, "Апр": 4, "Май": 5, "Июн": 6, "Июл": 7, "Авг": 8, "Сен": 9, "Окт": 10, "Ноя": 11, "Дек": 12 };
const months = Object.keys(monthNumbers);
const keyboard = [];

for (var i = 0; i < months.length; i += 3) {
  var row = [];
  for (var j = i; j < i + 3 && j < months.length; j++) {
    row.push({ text: months[j], callback_data: monthNumbers[months[j]] });    
  }
  keyboard.push(row);
}

const monthsKeyboard = {
  method: "post",
  contentType: "application/json",
  payload: JSON.stringify({
    reply_markup: { inline_keyboard: keyboard }
  })
};

function sendMessage2(textToSend, whoToSend, keyboardChoose) {
  let url = bot + `/sendMessage?chat_id=` + whoToSend + `&text=` + encodeURIComponent(textToSend);
  let payloadKeyboard;
  if (keyboardChoose == 'months') payloadKeyboard = monthsKeyboard 
  else if (keyboardChoose == 'delete') payloadKeyboard =  deleteKeyboard;
  UrlFetchApp.fetch(url, payloadKeyboard);
}


function updMessage(textToSend, chatId, messageId, keyboardChoose) {
  let url = bot + "/editMessageText?chat_id=" + chatId + "&message_id=" + messageId + "&text=" + encodeURIComponent(textToSend);
  UrlFetchApp.fetch(url, keyboardChoose);

}
function testSend() {
  sendMessage2("debug_month", myId)
}
