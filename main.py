from flask import Flask, render_template, request, jsonify
from flask_mysqldb import MySQL
import os
  
app = Flask(__name__, template_folder='.')  

mysql_user = os.environ["MYSQL_USER"]
mysql_password = os.environ["MYSQL_PASSWORD"]
mysql_database = os.environ["MYSQL_DATABASE"]
mysql_host = os.environ["MYSQL_HOST"]

# Required
app.config["MYSQL_USER"] = mysql_user
app.config["MYSQL_PASSWORD"] = mysql_password
app.config["MYSQL_DB"] = mysql_database
app.config["MYSQL_HOST"] = mysql_host
app.config["MYSQL_CURSORCLASS"] = "DictCursor"

mysql = MySQL(app)
  

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


@app.route('/get_categories', methods=['GET'])
def get_categories():
    try:
        telegram_id = request.args.get('telegram_id')
        if not telegram_id:
            return jsonify(success=False, error="telegram_id is required"), 400
            
        cursor = mysql.connection.cursor()
        cursor.execute("""
            SELECT c.id, c.name, c.color_hex 
            FROM Category c
            JOIN User u ON c.user_id = u.id
            WHERE u.telegram_id = %s
            ORDER BY c.id
        """, (telegram_id,))
        categories = cursor.fetchall()
        
        return jsonify(success=True, categories=categories)
    
    except Exception as e:
        return jsonify(success=False, error=str(e)), 500


@app.route('/update_category', methods=['POST'])
def update_category():
    try:
        data = request.get_json()
        category_id = data['category_id']
        new_name = data['new_name']
        
        cursor = mysql.connection.cursor()
        cursor.execute("UPDATE Category SET name = %s WHERE id = %s", (new_name, category_id))
        mysql.connection.commit()
        
        return jsonify(success=True)
    
    except KeyError:
        return jsonify(success=False, error="category_id and new_name are required"), 400
    except Exception as e:
        return jsonify(success=False, error=str(e)), 500


@app.route('/update_category_color', methods=['POST'])
def update_category_color():
    try:
        data = request.get_json()
        category_id = data['category_id']
        color_hex = data['color_hex']
        
        cursor = mysql.connection.cursor()
        cursor.execute("UPDATE Category SET color_hex = %s WHERE id = %s", (color_hex, category_id))
        mysql.connection.commit()
        
        return jsonify(success=True)
    
    except KeyError:
        return jsonify(success=False, error="category_id and color_hex are required"), 400
    except Exception as e:
        return jsonify(success=False, error=str(e)), 500
        

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port='80')  
