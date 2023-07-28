
let myId = 713088229;
let lehaId = 366684569;

//парсим post запрос, проверяем айди отправителя
function doPost(e) {
  let content = JSON.parse(e.postData.contents);
  
  //если нажата кнопка
  if (content.callback_query) {
    log(content.callback_query);
    let callbackData = content.callback_query.data;
    let chatId = content.callback_query.message.chat.id;
    let messageId = content.callback_query.message.message_id;
    let tranzId = String(content.callback_query.message.text).split(/\#/)[1] ;

    if (callbackData === "delete_tranz") {
      delete_tranz(chatId, tranzId);
      updMessage("Операция удалена", chatId, messageId);
    } else {
      let monthResult = inputMonth(callbackData, chatId)
      updMessage(monthResult, chatId, messageId, monthsKeyboard);
    }
  } else 
  
  
  
  
  //если обычное сообщение
  {
    let messageText = content.message.text;
    let mesSenderId = Number(content.message.from.id);
    let messageId = content.message.message_id;
    let user = new User(mesSenderId);
    user.parseText(messageText, messageId);
  }
}

function testMe() {
  let testMessage = '0 еДа';
  let meUser = new User(myId);
  meUser.parseText(testMessage);

}
