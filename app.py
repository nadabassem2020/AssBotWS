import os
import sys
import Feature_extraction
from flask import Flask, request
from pymessenger import Bot
from subprocess import call
from py2neo import Graph, NodeMatcher
from py2neo import Node
from neomodel import StructuredNode, StringProperty, RelationshipTo, RelationshipFrom, config
from py2neo.ogm import GraphObject, Property
from py2neo.data import Node, Relationship, Subgraph
from py2neo.database import Cursor
from py2neo.cypher import cypher_escape, cypher_repr

graph = Graph("bolt://localhost:11002", auth=("neo4j", "password"))

app = Flask(__name__)
PAGE_ACCESS_TOKEN = "EAADdApnGnnsBAIsBL4WzXOickov4baNVXnnH7fGs5QFn0CJKk4myQiO4lVui5LlwDfZC7ZCy2SSQC2C1tL8oySy9gnJOL2Is5D08wRStDBQ9O9Ddb8UBXfGZCJ8jadJOZCsIJLQmJuZAStZBFvL3d277dsHEmO5HOXGMdK40N1ZBwZDZD"
                     

bot = Bot(PAGE_ACCESS_TOKEN)

@app.route('/', methods = ['GET'])

def verify():
	if request.args.get("hub.mode") == "subscribe" and request.args.get("hub.challenge"):
		if not request.args.get("hub.verify_token") == "hello":
			return "Verification token mismatch", 403
		return request.args["hub.challenge"], 200
	return "HELLO WORLD", 200

@app.route('/', methods=['POST'])

def webhook():
	data = request.get_json()
	log(data)
	
	if data['object'] == 'page':
		for entry in data['entry']:
			for messaging_event in entry['messaging']:
				#IDs
				sender_id = messaging_event['sender']['id']
				recipient_id = messaging_event['recipient']['id']
				
				if messaging_event.get('message'):
					if 'text' in messaging_event['message']:
						messaging_text = messaging_event['message']['text']
					else:
						messaging_text = 'no-text'
					response = ''
					try:
						Feature_extraction.clear(Feature_extraction.FP.feature_)
						Feature_extraction.clear(Feature_extraction.FP.params_)	
						Feature_extraction.param_plot(Feature_extraction.wit_ne(messaging_text))
						call(["node", "E:\College\Y4 T2\GP\env\messenger bot\AssBotWS-master/app.js"]) 
						response = 'Everything is fine...'
					except:
						response = 'please be more specific'
					
					bot.send_text_message(sender_id, response)
					Feature_extraction.clear(Feature_extraction.FP.feat_par_dict)
					clear_nodes()	
					
					
					
	return "OK", 200

def log(message):
	print(message)
	sys.stdout.flush()

def clear_nodes():
	node_type = 'parameter'
	query = "match (n {type: \'%s\'}) delete (n)" % node_type
	graph.run(query)


if __name__ == "__main__":
	app.run(debug = True, port = 8080)
	
