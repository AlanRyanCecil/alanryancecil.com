from flask import Blueprint, request, jsonify, render_template
import pandas as pd
from bs4 import BeautifulSoup
import requests
import pymongo

from .scrape_info import scrape_charity_data


malaria = Blueprint('mapping-malaria', __name__,
                    template_folder='malaria_templates', static_folder='malaria_static')


@malaria.route('/mapping-malaria')
def home():
    client = pymongo.MongoClient('mongodb://localhost:27017')
    db = client.charities_db
    collection = db.charities
    scrape_charity_data()
    charity_data = collection.find()
    charities = [{'text': char['text'], 'link': char['link']} for char in charity_data]
    return render_template('malaria_index.html', charities=charities)


@malaria.route('/mapping-malaria/malaria')
def malariadata():
    df = pd.read_csv('malaria/malaria_static/data/Malaria_data_file.csv')
    data = []
    for index, row in df.iterrows():
        data.append({x: row[x] for x in row.index})
    return jsonify(data)


@malaria.route('/mapping-malaria/top/<number>')
def top(number):
    cases = 'Malaria cases/100,000 pop.'
    df = pd.read_csv('malaria/malaria_static/data/Malaria_data_file.csv')
    top_ten = df[['Country', 'Year', cases]].groupby(
        'Country').median().sort_values(cases, ascending=False).head(int(number)).index
    df = df.loc[df['Country'].isin(top_ten), :]
    data = []
    for i, row in df.iterrows():
        data.append({x: row[x] for x in row.index})
    return jsonify(data)


@malaria.route('/mapping-malaria/coordinates')
def coordinates():
    df = pd.read_csv('malaria/malaria_static/data/coordinates.csv')
    df = df.dropna()
    data = []
    for index, row in df.iterrows():
        data.append({x: row[x] for x in row.index})
    return jsonify(data)


if __name__ == '__main__':
    malaria.run(debug=True)
