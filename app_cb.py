import os
import sys
import Feature_extraction
import credentials, requests
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
import json

graph = Graph("bolt://localhost:11002", auth=("neo4j", "password"))

app = Flask(__name__)
PAGE_ACCESS_TOKEN = "EAADdApnGnnsBAIsBL4WzXOickov4baNVXnnH7fGs5QFn0CJKk4myQiO4lVui5LlwDfZC7ZCy2SSQC2C1tL8oySy9gnJOL2Is5D08wRStDBQ9O9Ddb8UBXfGZCJ8jadJOZCsIJLQmJuZAStZBFvL3d277dsHEmO5HOXGMdK40N1ZBwZDZD"                   
WEBHOOK_VERIFY_TOKEN = "hello"
bot = Bot(PAGE_ACCESS_TOKEN)

@app.route('/', methods = ['GET'])

def verify():
		if request.args.get("hub.mode") == "subscribe" and request.args.get("hub.challenge"):
			if not request.args.get("hub.verify_token") == WEBHOOK_VERIFY_TOKEN:
				return "Verifcation token mismatched", 403
			return request.args["hub.challenge"], 200
		return "Hello World", 200

@app.route('/', methods = ['POST'])

def webhook():
	data = request.get_json()
	log(data)
	Feature_extraction.clear(Feature_extraction.FP.feat_par_dict)
	clear_nodes()

	if data['object'] == 'page':
		for entry in data['entry']:
			for messaging_event in entry['messaging']:
				sender_id = messaging_event['sender']['id']
				# check if the message is of type text
				if messaging_event.get('message'):
					if 'text' in messaging_event['message']:
						messaging_text = messaging_event['message']['text']
					else:
						messaging_text = 'no-text'
					try:
						Feature_extraction.param_plot(Feature_extraction.wit_ne(messaging_text))
					except:
						response = 'Sorry, can you try again?'
					try:
						call(["node", "E:\College\Y4 T2\GP\env\messenger bot\AssBotWS-master/app_.js"])
					except:
						response = 'Sorry, We dont yet offer this service'
					try:
						# response = sendJSON(readJSON('apiresp.json'))
						response = try_features()
						print('Final Response is ' + response)
					except:
						return 'Non of the features in app_cb fit this message'
					bot.send_text_message(sender_id, response)
					Feature_extraction.clear(Feature_extraction.FP.feat_par_dict)
					clear_nodes()	
	return "ok", 200


# def webhook():
# 	data = request.get_json()
# 	log(data)
# 	messaging_text = ''
#     messaging_events = data['entry'][0]['messaging']

# 	for messaging in messaging_events:
# 		sender_id = messaging_event['sender']['id']
# 		recipient_id = messaging_event['recipient']['id']

# 		if text_input in GREETINGS:
#     			response_text = 'Hello, welcome to assistant bot'
# 		elif messaging_event.get('message'):	
# 			if messaging_event['message'].get('text'):
# 					messaging_text = messaging_event['message']['text']
# 			else:
# 				messaging_text = 'no-text'
# 	# Feature_extraction.param_plot(Feature_extraction.wit_ne(messaging_text))
# 	# call(["node", "E:\College\Y4 T2\GP\env\messenger bot\AssBotWS-master/app_.js"])
# 	print("THE MASSEGE IS " + messaging_text)
# 	try:
# 		# if send_message_music('apiresp.json') != -1:
# 		# 	response = send_message_music('apiresp.json')
# 		# 	try:
# 		# 		bot.send_text_message(sender_id, response)
# 		# 	except:
# 		# 		bot.send_text_message(sender_id, 'try again')
# 		# 	return "Message processed"
			
# 		# elif send_message_translate('apiresp.json') != -1:
# 		# 	response = send_message_translate('apiresp.json')
# 		# 	try:
# 		# 		bot.send_text_message(sender_id, response)
# 		# 	except:
# 		# 		bot.send_text_message(sender_id, 'try again')
# 		# 	return "Message processed"
# 		# elif send_message_calories('apiresp.json') != -1:
# 		# 	response = send_message_movies('apiresp.json')
# 		# 	try:
# 		# 		bot.send_text_message(sender_id, response)
# 		# 	except:
# 		# 		bot.send_text_message(sender_id, 'try again')
# 		# 	return "Message processed"

# 		# elif send_message_corona('apiresp.json') != -1:
# 		# 	response = send_message_corona('apiresp.json')
# 		response = messaging_text
# 	except:
# 			response = 'Sorry can you be more specific'
				
		


	# Feature_extraction.clear(Feature_extraction.FP.feat_par_dict)
	# clear_nodes()	
			
# reads the file and puts its content in an array
# def readJSON(filename): 
# 	f = open(filename)
# 	data = json.load(f)
# 	response_array = []
# 	for x in data:
# 		response_array.append(x)
# 	response_array.sort()
# 	return response_array

# def sendJSON(response_array):
# 	final_reps = ''
# 	for i in response_array:
# 		final_reps += i
# 	return final_reps

def try_features():
	try:
		if send_message_music('apiresp.json') != -1:
			response = send_message_music('apiresp.json')
			return response
			
		elif send_message_translate('apiresp.json') != -1:
			response = send_message_translate('apiresp.json')
			return response

		elif send_message_calories('apiresp.json') != -1:
			response = send_message_calories('apiresp.json')
			return response
		else:
			return 'Sorry, can you be more specific?'
	except:
		return 'error in trying features'

def send_message_music(filename):
	try:
		f = open(filename)
		data = json.load(f) 
		response = data['name']  + ' ' + data['url']
		print("IT WORKS")
		return response
	except:
		print('Not the Music Feature')
		return -1

def send_message_translate(filename):
	try:
		f = open(filename)
		data = json.load(f)
		# access json file and add its content in a variable
		# {"translation":"люблю вас"}
		response = data['translation']
		# return the translation of the word ' bottle ' 
		return response
	except:
		print('Not the Translate Feature')
		return -1

def send_message_calories(filename):
	try:
		f = open(filename)
		data = json.load(f) 
		# access json file and add its content in a variable
		# {"suger":1.94,"fat_sat":3.966,"carbs":3.36,"cholestrol":136,"iron":1.97,"sodium":559,"pottassium":218}
		response = 'suger : ' + str(data['suger']) + ' - saturated fats :  ' + str(data['fat_sat']) + ' - carbs : ' + str(data['carbs']) + ' - cholestrol : ' + str(data['cholestrol']) + ' - iron : ' + str(data['iron']) + ' - sodium : ' + str(data['sodium']) + ' - pottassium : ' + str(data['pottassium'])
		# return the translation of the word ' bottle ' 
		return response
	except:
		print('Not the Calories Feature')
		return -1

# def send_message_corona(filename):
# 	try:
# 		f = open(filename)
# 		data = json.load(f) 
# 		response = data['recovered'] + '	 ' + data['death'] + ' ' + data['confirmed']
# 		return response
# 	except:
# 		print('SEND MESSAGE translation FUNCTION PROBLEM!!')
# 		return -1
    	

def log(message):
	print(message)
	sys.stdout.flush()

def clear_nodes():
	node_type = 'parameter'
	query = "match (n {type: \'%s\'}) delete (n)" % node_type
	graph.run(query)


if __name__ == "__main__":
	app.run(debug = True, port = 8080)
	
