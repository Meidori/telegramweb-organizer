from flask import Flask, render_template, request, jsonify
from flask_mysqldb import MySQL
import os
  
app = Flask(__name__, template_folder='.')  

mysql_user = os.environ["MYSQL_USER"]
mysql_password = os.environ["MYSQL_PASSWORD"]
mysql_database = os.environ["MYSQL_DATABASE"]

# Required
app.config["MYSQL_USER"] = mysql_user
app.config["MYSQL_PASSWORD"] = mysql_password
app.config["MYSQL_DB"] = mysql_database
app.config["MYSQL_CURSORCLASS"] = "DictCursor"
  
@app.route("/")  
def web():  
    return render_template('index.html')  

@app.route('/save_user', methods=['POST'])
def save_user():
    try:
        data = request.get_json()
        telegram_id = data['telegram_id'] 
        
        cursor = mysql.connection.cursor()
        cursor.execute("INSERT INTO `User` (telegram_id) VALUES (%s)", (telegram_id,))
        mysql.connection.commit()
        
        return jsonify(success=True)
    
    except KeyError:
        return jsonify(success=False, error="telegram_id is required"), 400
    except Exception as e:
        return jsonify(success=False, error=str(e)), 500
    finally:
        cursor.close()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port='80')  
