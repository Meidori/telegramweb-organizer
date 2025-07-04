# Deployment on VDS

1. Installing dependencies
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv mysql-server nginx
```

2. Cloning the repository
```bash
git clone https://github.com/Meidori/telegramweb-organizer
cd telegramweb-organizer
```

3. Creating and activating a virtual environment
```bash
python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt    # install dependencies
```

4. Creating and importing the database
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

5. Setting environment variables
```bash
vim .env    # you can use any other text editor
```

```vim
MYSQL_USER=<user>
MYSQL_PASSWORD=<password>
MYSQL_DATABASE=<database>
MYSQL_HOST=<host>
```

6. Configuring Nginx
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

Activating the configuration
```bash
sudo ln -s /etc/nginx/sites-available/organizer /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```

7. Changing the port for Flask

Replace the following line in `main.py`:
```python
app.run(debug=True, host="0.0.0.0", port='80')
```

with:
```python
app.run(debug=True, host="0.0.0.0", port=5000)
```

8. Running the application
```bash
source venv/bin/activate
python main.py
```

9. Configuring the Telegram WebApp

- Create a bot via @BotFather
- In the bot settings, add your application's domain in the "Web App" section
- Use a URL like: `https://your_domain.com` for the WebApp

> [!Important]
> The domain must have an SSL certificate

# Deployment on [Amvera](https://cloud.amvera.ru)

1. Deploying the site to the cloud: https://habr.com/ru/companies/amvera/articles/833482/
2. Adding a Web App: https://habr.com/ru/companies/amvera/articles/838180/
3. Creating a database: https://docs.amvera.ru/databases/mysql.html
4. Importing the database from the dump (`TgOrganizer.sql`) in the phpmyadmin interface
5. Adding environment variables (under the `Variables` tab in the project interface)
```
MYSQL_USER=<user>
MYSQL_PASSWORD=<password>
MYSQL_DATABASE=<database>
MYSQL_HOST=<amvera-username-run-mysqlname>
```

>[!Note]
>The configuration file `amvera.yml` is already in the [repository](https://github.com/Meidori/telegramweb-organizer/tree/master)