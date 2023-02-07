var token = 'ass';
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('fin')
    .addItem('parse shit', 'getMessages')
    .addToUi();
}


//парсим post запрос, проверяем айди отправителя
function doPost(e) {
  var content = JSON.parse(e.postData.contents);
  var mesText = content.message.text;
  var mesSenderId = Number(content.message.from.id);

  if (mesSenderId == myId) {
    parseText(mesText);
  }
  else {
    sendMessageNotMe('who dfck a u?', mesSenderId)
  }
};

//проверяем что за сообщение. Команда на функцию или транзакция
function parseText(textToParse) {
  var regexSumAndCateg = /\d+\s[А-я\-]+/;
  var matchesRegex = regexSumAndCateg.test(textToParse);

  if (textToParse == '/mois') {
    monthTotal();
  }
  else if (matchesRegex) {
    commitTransaction(textToParse);
  }
  else {
    incorrectInput();
  }
};

//записываем транзакцию в базу (мск время сука)
function commitTransaction(tranz) {
  var sheet = SpreadsheetApp.getActive().getSheetByName('tranz');
  var tranzTime = new Date();

  //текст сообщения. Разделяю массив "сумма категория". Потом пишу всё
  var sumAndCat = tranz.split(" ");
  var dateSumCat = [tranzTime, sumAndCat[0], sumAndCat[1]];
  sheet.appendRow(dateSumCat);
  sendMessage('Committed');
}

//возвращает месячные траты
function monthTotal() {
  var sheet = SpreadsheetApp.getActive().getSheetByName('categ');
  var textTotalMonth = sheet.getRange("K1").getValue();
  sendMessage(textTotalMonth);
};

//отправляет сообщение
function sendMessage(textToSend) {
  var url = 'https://api.telegram.org/bot' + token + '/sendMessage?chat_id=' + myId + '&text=' + textToSend;
  UrlFetchApp.fetch(url);
};
//отправляет сообщение если айди не мой
function sendMessageNotMe(textToSend, whoId) {
  var url = 'https://api.telegram.org/bot' + token + '/sendMessage?chat_id=' + whoId + '&text=' + textToSend;
  UrlFetchApp.fetch(url);
};

function incorrectInput() {
  sendMessage('I dunno mate');
};

function doGet(e) {
  return HtmlService.createHtmlOutput("Привет ёпта");
};

function testTok() {
  Logger.log(this.token)
}









