from my_app import app
import json
from prophet.serialize import model_to_json, model_from_json
import pandas as pd
from datetime import date, datetime, timedelta
from flask import Response

city_map = {
    'Austin': 'austin',
    'miami': 'miami',
    'New York': 'newyork',
    'San Francisco': 'sanfran',
    'Washington': 'washington'
}

def load_model(city):
    with open(f'./models/{city}.json', 'r') as fin:
        m = model_from_json(json.load(fin)) 
    return m

def map_city(city):
    return city_map[city]

def set_periods(cur_date):
    last_train_date = date(2022, 12, 11)
    return cur_date - last_train_date

@app.route("/<city>/<periods>")
def hello_world(city=None, periods=None):
    city_mapped = map_city(city) # remap the city
    m = load_model(city_mapped)
    day_adder = set_periods(date(2022, 12, 16)).days
    future = m.make_future_dataframe(periods=int(periods)+day_adder)
    forecast = m.predict(future)
    today = datetime.now().strftime('%Y-%m-%d')
    mask = (forecast['ds'] > today) & (forecast['ds'] <= (datetime.now() + timedelta(days=int(periods))).strftime('%Y-%m-%d'))
    df = forecast.loc[mask][['ds','yhat']]
    df.ds = df.ds.dt.strftime('%Y-%m-%d')
    #print(df)
    return Response(df.to_json(orient="records"), mimetype='application/json')

    

    