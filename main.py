from flask import Flask, render_template  
from flask_mysqldb import MySQL
import os
  
app = Flask(__name__, template_folder='.')  

mysqluser = os.environ["mysqluser"]
mysqlpassword = os.environ["mysqlpassword"]
mysqldatabase = os.environ["mysqldatabase"]

# Required
app.config["MYSQL_USER"] = mysqluser
app.config["MYSQL_PASSWORD"] = mysqlpassword
app.config["MYSQL_DB"] = mysqldatabase
app.config["MYSQL_CURSORCLASS"] = "DictCursor"
  
@app.route("/")  
def web():  
    return render_template('index.html')  

@app.route('/save_user', methods=['POST'])
def save_user():
    data = request.get_json()
    telegram_id = data.get('telegram_id')
    
    if not telegram_id:
        return jsonify({'success': False, 'error': 'No telegram_id provided'}), 400
    
    try:
        cursor = mysql.connection.cursor()
        
        # check on exists
        cursor.execute("SELECT id FROM User WHERE telegram_id = %s", (telegram_id,))
        if cursor.fetchone():
            return jsonify({'success': True, 'message': 'User already exists'})
        
        cursor.execute("INSERT INTO User (telegram_id) VALUES (%s)", (telegram_id,))
        mysql.connection.commit()
        
        return jsonify({'success': True, 'message': 'User created successfully'})
    
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        cursor.close()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port='80')  
