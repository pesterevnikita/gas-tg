let bot = getUrlToken();
let vDate = new Date();
class User {
  constructor(tgIdIn) {
    this.tgId = tgIdIn;
    this.tgIdString = String(tgIdIn);
    //this.messageId = messageIdIn;
    this.sheetName = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(this.tgIdString);

    if (this.sheetName == null) {
      this.sheetName = SpreadsheetApp.getActiveSpreadsheet().insertSheet(this.tgIdString);
      //SpreadsheetApp.getActiveSpreadsheet().getSheetByName(this.tgId);
      this.sheetName.getRange("F1").setFormula(`={{(QUERY(A:D;"select C,sum(B) where month(A)+1 ="&month(TODAY())&" group by month(A)+1, C order by sum(B) desc label sum(B) ''"))};{(QUERY(A:D;"select '-Total-',sum(B) where month(A)+1 ="&month(TODAY())&" group by month(A)+1 label sum(B) '', '-Total-' ''"))}}`);
      this.sheetName.getRange("H1").setFormula(`="Расходы текущего месяца:
      "&textjoin("
      ";1;MAP(F1:F20;G1:G20;LAMBDA(a;b;TEXTJOIN(": ";TRUE;{a;b}))))`);

//другой месяц
      this.sheetName.getRange("J1").setFormula(`=IFERROR({{(QUERY(A:D;"select C,sum(B) where month(A)+1 ="&I1&" group by month(A)+1, C order by sum(B) desc label sum(B) ''"))};{""\""};{(QUERY(A:D;"select '-Total-',sum(B) where month(A)+1 ="&I1&" group by month(A)+1 label sum(B) '', '-Total-' ''"))}};"Нет данных ༼ つ ◕_◕ ༽つ")`);
      this.sheetName.getRange("L1").setFormula(`="Расходы "&text(date(2023;I1;1);"MMMM")&":
"&textjoin("
";1;MAP(J1:J20;K1:K20;LAMBDA(a;b;TEXTJOIN(": ";TRUE;{a;b}))))`);
      this.sheetName.getRange("I1").setFormula(vDate.getMonth());
    }
    this.commandHandlers = {
      '/start': this.registration,
      '/help': this.registration,
      '/month': this.userMonth,
      '/choose': this.chooseMonth,
    };
  }

  registration() {
    let welcomeMessage = `Welcome! Я бот для учета твоих финансовых расходов. 
    
    Каждый раз, когда ты тратишь деньги на покупку, тебе приходит пуш от банка. Не свайпай его, пока не отправишь мне сообщение в формате "1500 еда".
    
    Я буду запоминать все записи, и когда ты отправишь команду /month или /choose - я предоставлю тебе сводку месячных трат и ты сможешь проанализировать свои финансовые привычки.`;
    this.sendMessage(welcomeMessage);
  }

  parseText(textToParse, messageId) {
    let regexSumAndCateg = /^-?\d{1,7}\s{1,7}[А-яA-z\-_/]{1,20}$/;
    let matchesRegex = regexSumAndCateg.test(textToParse);
    let regexedText = String(regexSumAndCateg.exec(textToParse));
    if (textToParse in this.commandHandlers) {
      let whatToDo = this.commandHandlers[textToParse];
      whatToDo.call(this);
    }
    else if (matchesRegex) {
      this.commitTransaction(regexedText, messageId);
    }
    else {
      this.incorrectInput();
    }
  }

  commitTransaction(tranz, messageId) {
    let tranzTime = new Date();
    //текст сообщения. Разделяю массив "сумма категория". Потом пишу всё   
    let sumAndCat = String(tranz)
      .toLowerCase()
      .split(/\s{1,6}/);
    let dateSumCat = [tranzTime, sumAndCat[0], sumAndCat[1], messageId];
    this.sheetName.appendRow(dateSumCat);
    this.sendMessage(`Committed: ${sumAndCat[0]} ${sumAndCat[1]}, операция #${messageId}`, deleteKeyboard);
  }

  userMonth() {
    let userMonthTotal = this.sheetName.getRange("H1").getValue();
    this.sendMessage(userMonthTotal);
  }
  sendMessage(textToSend, optionsIf) {
    let url = bot + `/sendMessage?chat_id=` + this.tgId + `&text=` + encodeURIComponent(textToSend);
    UrlFetchApp.fetch(url, optionsIf);
  }
  incorrectInput() {
    this.sendMessage(`Вводи в формате "1500 категория"`);
  }
  chooseMonth() {
    this.sendMessage(`Выбери месяц`, monthsKeyboard)
  }

  ;
}
