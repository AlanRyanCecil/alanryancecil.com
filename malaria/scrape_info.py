from bs4 import BeautifulSoup
import requests
import pymongo


def scrape_charity_data():
    client = pymongo.MongoClient('mongodb://localhost:27017')
    db = client.charities_db
    collection = db.charities
    url = 'https://www.raptim.org/11-international-ngos-fighting-malaria/'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    charity_items = []
    results = soup.find('article', class_='right')
    headers = results.find_all('h3')
    for header in headers:
        header_text = header.find('strong').text

        p = header.next_sibling
        a = p.find('a')
        if a:
            charity_items.append({
                'text': header_text,
                'link': a['href']
            })
    collection.drop()
    collection.insert_many(charity_items)
