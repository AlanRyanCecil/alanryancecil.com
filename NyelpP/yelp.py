from flask import Blueprint, request, render_template, redirect, jsonify
from gensim.summarization import summarize
from wordcloud import WordCloud
# from config_yelp import api_key
import pandas as pd
import matplotlib
import requests
import spacy
import json
import re
import os

matplotlib.use('PS')

yelp = Blueprint('N-yelp-P', __name__,
                 template_folder='yelp_templates', static_folder='yelp_static')

df = pd.read_csv('NyelpP/yelp_static/data/top_21_businesses.csv', sep='\t')
nlp = spacy.load('en_core_web_sm')
top_10_businesses = df.groupby('name').count().sort_values('text', ascending=False)[:10].index

# headers = {'Authorization': f'bearer {api_key}'}
city = 'San Diego'
search_term = 'bar'
search_url = f'https://api.yelp.com/v3/businesses/search?location={city}&term={search_term}'

with open('NyelpP/yelp.json', 'r') as json_data:
    yelp_data = json.load(json_data)


@yelp.route('/n-yelp-p')
def yelpHome():
    return render_template('yelp_index.html', businesses=top_10_businesses)


@yelp.route('/n-yelp-p/data/<name>')
def pandas(name):
    ds = df.loc[df['name'] == name, :].copy()
    ds = ds.sort_values('date', ascending=False)
    data = []
    for i, row in ds.iterrows():
        data.append({x: row[x] for x in row.index})
    return jsonify(data)


@yelp.route('/n-yelp-p/business/<bid>')
def businessid(bid):
    with open('NyelpP/yelp_static/data/top_21_business_id_data.json', 'r') as file:
        data = json.load(file)
    data = [b for b in data if b['id'] == bid][0]
    return jsonify(data)


@yelp.route(('/n-yelp-p/tokens/<name>/<star>'))
def getTokens(name, star):
    ds = df.loc[df['name'] == name].sort_values('date', ascending=False)
    if star == '0':
        text = ' '.join(ds['text'][:200])
    else:
        text = ' '.join(ds.loc[ds['stars'] == int(star), 'text'][:300])
    summary = re.sub('\n', ' ', summarize(text[:70000], word_count=300))
    doc = nlp(summary)
    response = ''
    for tok in doc:
        if tok.pos_ == 'ADJ':
            response += ' <span class="adj-btn">' + tok.text + '</span>'
        elif tok.pos_ == 'NOUN':
            response += ' <span class="noun-btn">' + tok.text + '</span>'
        else:
            ws = '' if tok.pos_ == 'PUNCT' else ' '
            response += ws + tok.text
    return jsonify({'summary': response.strip()})


@yelp.route('/n-yelp-p/wordcloud/<name>/<star>')
def make_wordcloud(name, star):
    ds = df.loc[df['name'] == name].sort_values('date', ascending=False)
    if star == '0':
        reviews = ' '.join(ds['text'][:200])
    else:
        reviews = ' '.join(ds.loc[ds['stars'] == int(star), 'text'][:300])
    doc = nlp(reviews[:70000])
    text = [t.text for t in doc if t.pos_ == 'NOUN']
    freq_dict = {}
    for word in text:
        if re.match("your|person|place|that|thing", word):
            continue
        val = freq_dict.get(word, 0)
        freq_dict[word.lower()] = val + 1
    wc = WordCloud(width=600, height=300, background_color="white", max_words=2000)
    wc.generate_from_frequencies(freq_dict)
    wc.to_file('NyelpP/yelp_static/images/wordcloud.png')
    return jsonify({'success': True})


@yelp.route('/n-yelp-p/yelp')
def yelpyelp():
    return jsonify(yelp_data['businesses'])


if __name__ == '__main__':
    yelp.run(debug=True)
