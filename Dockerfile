# Используем Node.js образ в качестве базового образа
FROM node:latest

# Установка директории приложения внутри контейнера
WORKDIR /app

# Копируем файл package.json и package-lock.json (или yarn.lock)
COPY package*.json ./

# Устанавливаем зависимости приложения
RUN yarn

# Копируем все остальные файлы вашего приложения
COPY . .
COPY .env ./
# Определяем порт, который будет прослушивать ваше приложение внутри контейнера
EXPOSE 4000

# Команда, которая будет запускать ваше приложение при старте контейнера
CMD ["yarn", "start"]