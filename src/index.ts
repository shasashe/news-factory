import express from 'express';
import bodyParser from 'body-parser';
import { publishNews } from './api/news/publish';
import { getNewsFeed } from './api/news/feed';
import { getNewsDetails } from './api/news/[news_id]';
import { sendDailyNewspaper } from './api/newspaper/send';
import { connectWallet } from './api/users/connect-wallet';
import { getProfile } from './api/users/profile';

const app = express();
app.use(bodyParser.json());

app.post('/api/news/publish', publishNews);
app.get('/api/news/feed', getNewsFeed);
app.get('/api/news/:news_id', getNewsDetails);
app.post('/api/newspaper/send', sendDailyNewspaper);
app.post('/api/users/connect-wallet', connectWallet);
app.get('/api/users/profile', getProfile);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
