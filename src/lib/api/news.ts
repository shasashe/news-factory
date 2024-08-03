import { API_BASE_URL } from './config';

export async function publishNews(data) {
  const response = await fetch(`${API_BASE_URL}/news/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function getNewsFeed() {
  const response = await fetch(`${API_BASE_URL}/news/feed`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

export async function getNewsDetails(newsId) {
  const response = await fetch(`${API_BASE_URL}/news/${newsId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}
