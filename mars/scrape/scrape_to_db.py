from scrape_mars import scrape
from pprint import pprint
import pymongo


data = scrape()
client = pymongo.MongoClient('mongodb://localhost:27017')
db = client.mars_db
collection = db.mars
if data:
    collection.drop()
    collection.insert_one(data)
    pprint(data)
