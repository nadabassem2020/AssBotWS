import nltk
import en_core_web_sm
import os
from py2neo import Graph, NodeMatcher
from py2neo import Node
from neomodel import StructuredNode, StringProperty, RelationshipTo, RelationshipFrom, config
from py2neo.ogm import GraphObject, Property
from py2neo.data import Node, Relationship, Subgraph
from py2neo.database import Cursor
from py2neo.cypher import cypher_escape, cypher_repr
from neo4j import GraphDatabase
from nltk.tokenize import word_tokenize
from nltk.tag import pos_tag
from nltk.chunk import conlltags2tree, tree2conlltags
from nltk.chunk import ne_chunk
from nltk.tree import *
from nltk import RegexpParser
from sklearn import tree
from collections import Counter
from wit import Wit
from pandas import DataFrame

from ctypes import string_at
from sys import getsizeof
from binascii import hexlify

graph = Graph("bolt://localhost:11002", auth=("neo4j", "password"))
tx = graph.begin()
client = Wit('U5E2SCXLYY6ZFKQX3EBTLNPEAWOQA36B')

class FeatPar:
    feature_ = []
    params_ = []
    feat_par_dict = {}

FP = FeatPar()

def resp_test(messsage):
    resp = client.message(messsage)
    print(resp)

def f1(resp):
    try:
        param = resp['entities']['notable_person'][0]['value']['name']
        feature = resp['entities']['intent'][0]['value']
        FP.feature_.append(feature)
        FP.params_.append(param)

        FP.feat_par_dict = {
                     'feature': FP.feature_,
                     'params': FP.params_
                    }
        return FP.feat_par_dict
    except:
        return -1

def f2(resp):
    try:
        feature = resp['entities']['intent'][0]['value']
        param = resp['entities']['music'][0]['entities']['notable_person'][0]['value']['name']
        FP.feature_.append(feature)
        FP.params_.append(param)

        FP.feat_par_dict = {
                     'feature': FP.feature_,
                     'params': FP.params_
                    }
        return FP.feat_par_dict
    except:
        return -1

def f3(resp):
    try:
        feature = resp['entities']['intent'][0]['value']
        params = resp['entities']['creative_work'][0]['value']
        FP.feature_.append(feature)
        FP.params_.append(params)

        FP.feat_par_dict = {
                     'feature': FP.feature_,
                     'params': FP.params_
                    }
        return FP.feat_par_dict
    except:
        return -1

def f4(resp):
    try:
        feature = resp['entities']['intent'][0]['value']
        param = resp['entities']['movies'][0]['value']
        FP.feature_.append(feature)
        FP.params_.append(param)

        FP.feat_par_dict = {
                     'feature': FP.feature_,
                     'params': FP.params_
                    }
        return FP.feat_par_dict
    except:
        return -1

def f5(resp):
    try:
        feature = resp['entities']['intent'][0]['value']
        param1 = resp['entities']['location'][0]['resolved']['values'][0]['coords']['lat']
        param2 = resp['entities']['location'][0]['resolved']['values'][0]['coords']['long']
        FP.feature_.append(feature)
        FP.params_.append(param1)
        FP.params_.append(param2)

        FP.feat_par_dict = {
                     'feature': FP.feature_,
                     'params': FP.params_
                    }
        return FP.feat_par_dict
    except:
        return -1   

def f6(resp):
    try:
        feature = resp['entities']['intent'][0]['value']
        param = resp['entities']['music'][0]['value']
        FP.feature_.append(feature)
        FP.params_.append(param)

        FP.feat_par_dict = {
                     'feature': FP.feature_,
                     'params': FP.params_
                    }
        return FP.feat_par_dict
    except:
        return -1

def wit_ne(messsage):
    resp = client.message(messsage)
    
    if f1(resp) != -1:
        return(FP.feat_par_dict)
         
    elif f2(resp) != -1:
        return(FP.feat_par_dict)

    elif f3(resp) != -1:
        return(FP.feat_par_dict)

    elif f4(resp) != -1:
        return(FP.feat_par_dict)

    elif f5(resp) != -1:
        return(FP.feat_par_dict)

    elif f6(resp) != -1:
        return(FP.feat_par_dict)
    else:
        print('EVERY THING FAILED!!!!')
        return -1
    

def tokenize(msg):
    noun_list = []
    verb_list = []
    msg_lower = msg.lower()
    tokens = nltk.word_tokenize(msg_lower)
    
    tag = nltk.pos_tag(tokens)
    print(tag)
   
    # pattern = """ 
    # feature:{<DT><NN>?}
    #     {<TO><VB>?}
    # """

    # cp = nltk.RegexpParser(pattern)
    # cs = cp.parse(tag)

    
    for i in (tag):
        for j in i:
            if j == 'NN':
                noun_list.append(i[0])

                print(i[0])
            if j == 'VB':
                verb_list.append(i[0])
                print(i[0]) 
    
    print(noun_list)
    print(verb_list)
    noun_list.extend(verb_list)
    NV = noun_list
    
    print(NV)    
    return NV

def ext_feature(NV):
    matcher = NodeMatcher(graph)
    name = ""   #the first entity from the user input
    for i in range(0, len(NV)):
        name = NV[i]
        input_node = Node(name)
        matched_feat_node = matcher.match(name).first() 
        if matched_feat_node is not None:
            class matches(Relationship): pass
            r = matches(input_node, matched_feat_node)
            break
    return dict(matched_feat_node)['feature']


def param_plot(dict):
    matcher = NodeMatcher(graph)
    matched_nodes = {}
    
    feature_value = dict['feature'][0]
    print("Feature extraction file, param plot function " + feature_value)
    query = 'match(n {feature:\'%s\'}) return n' % feature_value 

    for i in range(len(dict['params'])):
        a = Node(dict['params'][i], feature = dict['feature'][0], type = 'parameter')
        graph.create(a)
    print( dict['params'])
    print( FP.feat_par_dict)

        
        
        # while matched_nodes.forward():
        #     
        #     print(type(matched_nodes.current))
        #     #graph.create(r)

    #print(matched_nodes)
    
def clear(dict):
    dict['params'] = []
    dict['feature'] = []

    


#resp_test('where can i watch star wars?')
param_plot(wit_ne("send me some songs for tom odell"))
# a = Node('dummy', feature = 'music', type = 'parameter')
# graph.create(a)
