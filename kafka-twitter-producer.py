#!/usr/bin/env python


# import required libraries
from kafka import SimpleProducer, KafkaClient
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import requests
import json

consumer_key = 'pzu1itjDrGYn7KLP4rXZ8ZIK9'#eWkgf0izE2qtN8Ftk5yrVpaaI
consumer_secret = 'b8LmOC1eBX6BaPKSz4p3L7RmqSX8h66KalzO9U8pghxefU6oVV'#BYYnkSEDx463mGzIxjSifxfXN6V1ggpfJaGBKlhRpUMuQ02lBX
access_token = '833980353077460992-lTNpotqINeW0RhTt2BVQA9x1hrWnkpj'#1355650081-Mq5jok7mbcrIbTpqZPcMHgWjcymqSrG1kVaut39
access_token_secret = 'A4qYh3LfSXozowL0aAfU5ZjjODCFMzsPnCgJD3XJus0Wi'#QovqxQnw0hSPrKwFIYLWct3Zv4MeGMash66IaOoFyXNWs

headers = {'content-type': 'application/json'}


# Kafka settings
topic = b'twitter-stream'

# setting up Kafka producer
kafka = KafkaClient('localhost:9092')
producer = SimpleProducer(kafka)


#This is a basic listener that just puts received tweets to kafka cluster.
class StdOutListener(StreamListener):
    def on_data(self, data):
        data_json=json.loads(data)
	params={"sentence": data_json["text"]}
	r = requests.post('http://0.0.0.0:8000/queries.json',data=json.dumps(params),headers=headers)
	print json.loads(r.text)["sentiment"]
        data_json["sentiment"]=json.loads(r.text)["sentiment"]
	producer.send_messages(topic, json.dumps(data_json).encode('utf-8'))
	print data
        return True

    def on_error(self, status):
        print status

WORDS_TO_TRACK = "the to and is in it you of for on my that at with me do have just this be so are not was but out up what now new from your like good no get all about we if time as day will one how can some an am by going they go or has know today there love more work too got he back think did when see really had great off would need here thanks been still people who night want why home should well much then right make last over way does getting watching its only her post his morning very she them could first than better after tonight our again down news man looking us tomorrow best into any hope week nice show yes where take check come fun say next watch never bad free life".split()

if __name__ == '__main__':
    print 'running the twitter-stream python code'
    #This handles Twitter authetification and the connection to Twitter Streaming API
    l = StdOutListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    stream = Stream(auth, l)
    # Goal is to keep this process always going
    while True:
        try:
            stream.sample()
            stream.filter(languages=["en"], track=WORDS_TO_TRACK)
        except:
            pass
