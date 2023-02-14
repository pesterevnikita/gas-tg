function doPost(e) {
  let content = JSON.parse(e.postData.contents);
  let messageText = content.message.text;
  let mesSenderId = Number(content.message.from.id);

  let user = new User(mesSenderId);
  user.parseText(messageText);
}
