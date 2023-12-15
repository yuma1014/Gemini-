const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('@line/bot-sdk');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const config = {
  channelAccessToken: 'IsQPI679BNb17WQIK30UDnX8YqslCZlco4T9DsuOnp26ejPk7YYIy79nWMw6Ok2ynV7IqwDUxb0FjeMgiG3aODLa0RpFOUIvCP75XOF1dYUL96MwmJgA6NMNie56rHsybntzyBksF54uGozAgfaKrAdB04t89/1O/w1cDnyilFU=',
  channelSecret: '180d32341805cfb8f17b4093c67904ce',
};

const client = new Client(config);

// 使用 body-parser 中間件來解析請求主體
app.use(bodyParser.json());

// 處理 Line 的 Webhook 請求
app.post('/webhook', (req, res) => {
  const events = req.body.events;
  events.forEach(async (event) => {
    if (event.type === 'message' && event.message.type === 'text') {
      const message = event.message.text;
      const userId = event.source.userId;

      // 將用戶發送的訊息轉發至 AI Chat API
      const aiResponse = await axios.post('AIzaSyD4zIfRAOVBHmduIY79h4hqaEFkn3LsTnE', {
        message,
        userId,
      });

      // 從 AI Chat API 中取得回覆訊息
      const aiMessage = aiResponse.data.message;

      // 回覆用戶 Line 的訊息
      await client.replyMessage(event.replyToken, {
        type: 'text',
        text: aiMessage,
      });
    }
  });
  res.json({ success: true });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
