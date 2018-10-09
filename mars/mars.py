from flask import Blueprint, jsonify, redirect, render_template
import pymongo

from mars.scrape.scrape_mars import scrape

client = pymongo.MongoClient('mongodb://localhost:27017')
db = client.mars_db
collection = db.mars


mars = Blueprint('mars', __name__,
    template_folder='mars_templates', static_folder='mars_static')


@mars.route('/mars')
def home():
    mars = collection.find_one()
    if mars == None:
        return render_template('204.html')
    return render_template('mars.html', mars=mars)


@mars.route('/mars/scrape')
def call_scrape():
    collection.drop()
    collection.insert_one(scrape())
    return redirect('/mars', code=302)

if __name__ == '__main__':
    mars.run(debug=True)
