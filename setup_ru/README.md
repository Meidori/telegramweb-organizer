# Развертывание на VDS

1. Установка зависимостей
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv mysql-server nginx
```

2. Кнорирование репозитория 
```bash
git clone https://github.com/Meidori/telegramweb-organizer
cd telegramweb-organizer
```

3. Создание и активирование виртуального окружения
```bash
python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt    # устанавливаем зависимости
```

4. Создание и импортирование базы данных
```bash
mysql -u <username> -p
```

```SQL
CREATE DATABASE TgOrganizer;
exit;
```

```bash
mysql -u <username> -p TgOrganizer < TgOrganizer.sql
```

5. Определение переменных окружения
```bash
vim .env    # можно использовать любой другой редактор
```

```vim
MYSQL_USER=<user>
MYSQL_PASSWORD=<password>
MYSQL_DATABASE=<database>
MYSQL_HOST=<host>
```

6. Настройка Nginx
```bash
sudo vim /etc/nginx/sites-available/organizer
```

```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Активация конфигурации
```bash
sudo ln -s /etc/nginx/sites-available/organizer /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```

7. Изменить порт для Flask

Замените в `main.py` строку:
```python
app.run(debug=True, host="0.0.0.0", port='80')
```

на:
```python
app.run(debug=True, host="0.0.0.0", port=5000)
```

8. Запуск приложения
```bash
source venv/bin/activate
python main.py
```

9. Настройка Telegram WebApp

- Создайте бота через @BotFather
- В настройках бота добавьте домен вашего приложения в раздел "Web App"
- Используйте URL вида: `https://your_domain.com` для WebApp

> [!Important]
> Домен должен обладать SSL сертификатом

# Развертывание на [Amvera](https://cloud.amvera.ru)

1. Деплой сайта в облако https://habr.com/ru/companies/amvera/articles/833482/
2. Добавление Web App https://habr.com/ru/companies/amvera/articles/838180/
3. Создание базы данных https://docs.amvera.ru/databases/mysql.html
4. В интерфейсе phpmyadmin импорт базы данных из дампа (`TgOrganizer.sql`)
5. Добавление переменных окружения (вкладка `Переменные` в интерфейсе проекта)
```
MYSQL_USER=<user>
MYSQL_PASSWORD=<password>
MYSQL_DATABASE=<database>
MYSQL_HOST=<amvera-username-run-mysqlname>
```

>[!Note]
>Конфигурационный файл amvera.yml уже находится в [директории](https://github.com/Meidori/telegramweb-organizer/tree/master)
