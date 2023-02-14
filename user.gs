let bot = getUrlToken();


class User {

  constructor(tgIdIn) {   
 
    this.tgId = tgIdIn;
    this.tgIdString = String(tgIdIn);
    //this.tgName = tgNameIn;
    this.sheetName = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(this.tgIdString);
    if (this.sheetName == null) {

      this.sheetName = SpreadsheetApp.getActiveSpreadsheet().insertSheet(this.tgIdString);
      //SpreadsheetApp.getActiveSpreadsheet().getSheetByName(this.tgId);
      
      this.sheetName.getRange("F1").setFormula(`={{(QUERY(A:D;"select C,sum(B) where month(A)+1 ="&month(TODAY())&" group by month(A)+1, C order by sum(B) desc label sum(B) ''"))};{(QUERY(A:D;"select '-Total-',sum(B) where month(A)+1 ="&month(TODAY())&" group by month(A)+1 label sum(B) '', '-Total-' ''"))}}`);
      this.sheetName.getRange("H1").setFormula(`="Расходы текущего месяца:
      "&textjoin("
      ";1;MAP(F1:F20;G1:G20;LAMBDA(a;b;TEXTJOIN(": ";TRUE;{a;b}))))`);
    }
    this.commandHandlers = {
    '/start': this.registration,
    '/help': this.registration,
    '/month' : this.userMonth
  };
  }

  registration() {
    let welcomeMessage = `Welcome! Я бот для учета твоих финансовых расходов. 
    
    Каждый раз, когда ты тратишь деньги на покупку, тебе приходит пуш от банка. Не свайпай его, пока не отправишь мне сообщение в формате "1500 еда".
    
    Я буду запоминать все записи, и когда ты отправишь команду /month - я предоставлю тебе сводку месячных трат и ты сможешь проанализировать свои финансовые привычки.`;
this.sendMessage(welcomeMessage);
  }


  parseText(textToParse) {
    let regexSumAndCateg = /^-?\d{1,7}\s{1,7}[А-яA-z\-_/]{1,20}$/;
    let matchesRegex = regexSumAndCateg.test(textToParse);
    let regexedText = String(regexSumAndCateg.exec(textToParse));
  if (Object.keys(this.commandHandlers).includes(textToParse)) {
    
    let whatToDo = this.commandHandlers[textToParse];
  whatToDo.call(this);
  }
    else if (matchesRegex) {
      this.commitTransaction(regexedText);
    }
    else {
      this.incorrectInput();
    }
  }
  

  commitTransaction(tranz) {
    let tranzTime = new Date();
    //текст сообщения. Разделяю массив "сумма категория". Потом пишу всё
    let sumAndCat = tranz.split(/\s{1,6}/);
    let dateSumCat = [tranzTime, sumAndCat[0], sumAndCat[1]];
    this.sheetName.appendRow(dateSumCat);
    this.sendMessage('Committed');
  }


  userMonth() {
    let userMonthTotal = this.sheetName.getRange("H1").getValue();
    this.sendMessage(userMonthTotal);
  }
  sendMessage(textToSend) {
    let url = bot + '/sendMessage?chat_id=' + this.tgId + '&text=' + encodeURIComponent(textToSend);

    UrlFetchApp.fetch(url);
  }
  incorrectInput() {
    this.sendMessage(`Вводи в формате "1500 категория"`);
  };

}
