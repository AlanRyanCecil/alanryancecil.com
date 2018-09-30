import requests
import pandas as pd
from splinter import Browser
from bs4 import BeautifulSoup as bs
from splinter.exceptions import ElementDoesNotExist
import re

executable_path = {'executable_path': '/usr/local/bin/chromedriver'}


def scrape():
    browser = Browser('chrome', **executable_path, headless=True)
    news_source = 'https://mars.nasa.gov/news'
    browser.visit(news_source)
    mars_html = browser.html
    nasoup = bs(mars_html, 'lxml')
    post = nasoup.find('div', class_='image_and_description_container')

    news_title = post.find('div', class_='content_title').a.text
    news_teaser = post.find('div', class_='article_teaser_body').text

    jpl_base_url = 'https://www.jpl.nasa.gov'
    jpl_source = jpl_base_url + '/spaceimages/?search=&category=Mars'
    browser.visit(jpl_source)
    jpl_img_html = browser.html
    jetsoup = bs(jpl_img_html, 'lxml')

    featured_image_url = jpl_base_url + jetsoup.find(
        'div', class_='carousel_container'
    ).footer.a['data-fancybox-href']
    featured_image_title = jetsoup.find(
        'h1', class_='media_feature_title').text.strip()
    featured_image = {
        'url': featured_image_url,
        'title': featured_image_title,
    }

    weather_source = 'https://twitter.com/marswxreport?lang=en'
    browser.visit(weather_source)
    weather_html = browser.html
    weathsoup = bs(weather_html, 'lxml')
    mars_weather = weathsoup.find(
        'p', class_='js-tweet-text', text=re.compile(
            'Sol\s.+')).text.split(', ')

    mars_weather = [
        re.sub('(^\w+)\s', r'\1{}'.format('.' * (42 - len(x))), x) for x in mars_weather
    ]

    mars_facts_source = 'https://space-facts.com/mars/'
    mars_facts_df, = pd.read_html(mars_facts_source)

    mars_facts_html = mars_facts_df.to_html(header=False, index=False)

    hemisphere_source = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
    browser.visit(hemisphere_source)

    links = [(x.text.replace(' Hemisphere Enhanced', ''), x['href']) for x in browser.find_by_css(
        'div[class="description"] a'
    )]

    hemisphere_image_urls = []
    for link in links:
        browser.visit(link[1])
        img_url = browser.find_by_css('img[class="wide-image"]')['src']
        hemisphere_image_urls.append({
            'title': link[0],
            'img_url': img_url,
        })

    browser.quit()

    return {
        'news_title': news_title,
        'news_teaser': news_teaser,
        'featured_image': featured_image,
        'weather_lines': mars_weather,
        'facts_table': mars_facts_html,
        'hemisphere_image_urls': hemisphere_image_urls,
        'news_source': news_source,
        'jpl_source': jpl_source,
        'weather_source': weather_source,
        'facts_source': mars_facts_source,
        'hemisphere_source': hemisphere_source,
    }
