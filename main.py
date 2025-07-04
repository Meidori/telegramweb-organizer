from flask import Flask, render_template, request, jsonify
from flask_mysqldb import MySQL
import os
from dotenv import load_dotenv

load_dotenv()
  
app = Flask(__name__, template_folder='.', static_folder='static')

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
        new_color = data['new_color']
        
        cursor = mysql.connection.cursor()
        cursor.execute("UPDATE Category SET color_hex = %s WHERE id = %s", (new_color, category_id))
        mysql.connection.commit()
        
        return jsonify(success=True)
    
    except KeyError:
        return jsonify(success=False, error="category_id and new_color are required"), 400
    except Exception as e:
        return jsonify(success=False, error=str(e)), 500


@app.route('/add_day_entry', methods=['POST'])
def add_day_entry():
    try:
        data = request.get_json()
        telegram_id = data['telegram_id']
        category_id = data['category_id']
        entry_date = data['date']
        
        cursor = mysql.connection.cursor()
        
        cursor.execute("SELECT id FROM User WHERE telegram_id = %s", (telegram_id,))
        user = cursor.fetchone()
        if not user:
            return jsonify(success=False, error="User not found"), 404
            
        user_id = user['id']
        
        cursor.execute("""
            SELECT id FROM DayEntry 
            WHERE user_id = %s AND category_id = %s AND DATE(entry_date) = %s
        """, (user_id, category_id, entry_date))
        existing_entry = cursor.fetchone()
        
        if existing_entry:
            return jsonify(success=True, message="Entry already exists")
            
        cursor.execute("""
            INSERT INTO DayEntry (user_id, entry_date, category_id)
            VALUES (%s, %s, %s)
        """, (user_id, entry_date, category_id))
        mysql.connection.commit()
        
        return jsonify(success=True)
        
    except KeyError as e:
        return jsonify(success=False, error=f"Missing required field: {str(e)}"), 400
    except Exception as e:
        return jsonify(success=False, error=str(e)), 500


@app.route('/remove_day_entry', methods=['POST'])
def remove_day_entry():
    try:
        data = request.get_json()
        telegram_id = data['telegram_id']
        category_id = data['category_id']
        entry_date = data['date']
        
        cursor = mysql.connection.cursor()
        
        cursor.execute("SELECT id FROM User WHERE telegram_id = %s", (telegram_id,))
        user = cursor.fetchone()
        if not user:
            return jsonify(success=False, error="User not found"), 404
            
        user_id = user['id']
        
        cursor.execute("""
            DELETE FROM DayEntry 
            WHERE user_id = %s AND category_id = %s AND DATE(entry_date) = %s
        """, (user_id, category_id, entry_date))
        mysql.connection.commit()
        
        return jsonify(success=True, deleted=cursor.rowcount > 0)
        
    except KeyError as e:
        return jsonify(success=False, error=f"Missing required field: {str(e)}"), 400
    except Exception as e:
        return jsonify(success=False, error=str(e)), 500


@app.route('/get_day_entries', methods=['GET'])
def get_day_entries():
    try:
        telegram_id = request.args.get('telegram_id')
        date = request.args.get('date')
        if not telegram_id or not date:
            return jsonify(success=False, error="telegram_id and date are required"), 400
            
        cursor = mysql.connection.cursor()
        
        cursor.execute("SELECT id FROM User WHERE telegram_id = %s", (telegram_id,))
        user = cursor.fetchone()
        if not user:
            return jsonify(success=False, error="User not found"), 404
            
        user_id = user['id']
        
        cursor.execute("""
            SELECT category_id 
            FROM DayEntry 
            WHERE user_id = %s AND DATE(entry_date) = %s
        """, (user_id, date))
        entries = cursor.fetchall()
        
        return jsonify(success=True, entries=entries)
    
    except Exception as e:
        return jsonify(success=False, error=str(e)), 500


@app.route('/get_year_stats', methods=['GET'])
def get_year_stats():
    try:
        telegram_id = request.args.get('telegram_id')
        year = request.args.get('year')
        
        if not telegram_id or not year:
            return jsonify(success=False, error="telegram_id and year are required"), 400
            
        cursor = mysql.connection.cursor()
        
        cursor.execute("SELECT id FROM User WHERE telegram_id = %s", (telegram_id,))
        user = cursor.fetchone()
        if not user:
            return jsonify(success=False, error="User not found"), 404
            
        user_id = user['id']
        
        stats = {}
        for month in range(1, 13):
            days_in_month = 31 
            
            cursor.execute("""
                SELECT 
                    c.id AS category_id,
                    COUNT(de.id) AS count,
                    DAY(LAST_DAY(%s-%s-01)) AS days_in_month
                FROM Category c
                LEFT JOIN DayEntry de ON 
                    de.category_id = c.id AND 
                    de.user_id = %s AND 
                    YEAR(de.entry_date) = %s AND 
                    MONTH(de.entry_date) = %s
                WHERE c.user_id = %s
                GROUP BY c.id
            """, (year, month, user_id, year, month, user_id))
            
            month_stats = {}
            for row in cursor.fetchall():
                month_stats[row['category_id']] = {
                    'count': row['count'],
                    'days_in_month': row['days_in_month']
                }
            
            stats[month - 1] = month_stats 
        
        return jsonify(success=True, stats=stats)
    
    except Exception as e:
        return jsonify(success=False, error=str(e)), 500


@app.route('/add_category', methods=['POST'])
def add_category():
    try:
        data = request.get_json()
        telegram_id = data['telegram_id']
        name = data['name']
        color_hex = data.get('color_hex', '#FFFFFF')
        
        cursor = mysql.connection.cursor()
        
        # Get user ID
        cursor.execute("SELECT id FROM User WHERE telegram_id = %s", (telegram_id,))
        user = cursor.fetchone()
        if not user:
            return jsonify(success=False, error="User not found"), 404
            
        user_id = user['id']
        
        # Insert new category
        cursor.execute("""
            INSERT INTO Category (user_id, name, color_hex)
            VALUES (%s, %s, %s)
        """, (user_id, name, color_hex))
        mysql.connection.commit()
        
        return jsonify(success=True, category_id=cursor.lastrowid)
        
    except KeyError:
        return jsonify(success=False, error="telegram_id and name are required"), 400
    except Exception as e:
        return jsonify(success=False, error=str(e)), 500


@app.route('/delete_category', methods=['POST'])
def delete_category():
    try:
        data = request.get_json()
        telegram_id = data['telegram_id']
        category_id = data['category_id']
        
        cursor = mysql.connection.cursor()
        
        # Verify user owns the category
        cursor.execute("""
            SELECT c.id 
            FROM Category c
            JOIN User u ON c.user_id = u.id
            WHERE u.telegram_id = %s AND c.id = %s
        """, (telegram_id, category_id))
        category = cursor.fetchone()
        
        if not category:
            return jsonify(success=False, error="Category not found or not owned by user"), 404
            
        # Delete category
        cursor.execute("DELETE FROM Category WHERE id = %s", (category_id,))
        mysql.connection.commit()
        
        return jsonify(success=True)
        
    except KeyError:
        return jsonify(success=False, error="telegram_id and category_id are required"), 400
    except Exception as e:
        return jsonify(success=False, error=str(e)), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port='80')      # for amvera
    # app.run(debug=True, host="0.0.0.0", port=5000)    # for own VDS

