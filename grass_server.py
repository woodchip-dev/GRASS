#!/usr/bin/env python

from flask import Flask, render_template, redirect, url_for, request, jsonify, make_response
from flask_sockets import Sockets
from flask_pymongo import PyMongo
import json

app = Flask(__name__)
app.config['MONGO_DBNAME'] = 'grass'
mongo = PyMongo(app)
sock = Sockets(app)


@sock.route('/')
def echo_sock(ws):
	if True:
		roots_list = get_roots_from_db()
		ws.send(json.dumps(roots_list))

	with mongo.db.roots.watch() as watch_roots:
		for change in watch_roots:
			if change['operationType'] == 'insert' or change['operationType'] == 'delete':
				roots_list = get_roots_from_db()
				ws.send(json.dumps(roots_list))

@sock.route('/admin')
def echo_socka(wsa):
	if True:
		bids_list = get_bids_for_all()
		roots_list = get_roots_from_db()
		book = {'bid': bids_list, 'roots': roots_list}
		wsa.send(json.dumps(book))

	with mongo.db.bids.watch() as watch_bids:
		for change in watch_bids:
			if change['operationType'] == 'insert' or change['operationType'] == 'delete' or change['operationType'] == 'update':			
				bids_list = get_bids_for_all()
				roots_list = get_roots_from_db()
				book = {'bid': bids_list, 'roots': roots_list}
				wsa.send(json.dumps(book))


@app.route('/', methods = ['GET', 'POST'])
def index():
	if request.method == 'POST':
		if request.data:
			the_bid = json.loads(request.data)

			if the_bid['purpose'] == 'make_bid':
				success = 'false'
				citi_izhk = get_izhk_balance(the_bid['izn'])
				
				if replace_bid(the_bid['izn'], the_bid['root']):
					old_bal = 0
					bids_list = get_bids_for_citizen(the_bid['izn'])

					for item in bids_list:
						if item['root'] == the_bid['root']:
							old_bal = int(item['bid_amt'])

					if citi_izhk + old_bal - int(the_bid['bid_amt']) >= 0:
						success = 'true'

						update_bid(the_bid['izn'], the_bid['root'], int(the_bid['bid_amt']))
						update_balance(the_bid['izn'], citi_izhk + old_bal - int(the_bid['bid_amt']))
						citi_izhk += old_bal - int(the_bid['bid_amt'])
					
				elif citi_izhk - int(the_bid['bid_amt']) >= 0:
					success = 'true'
					
					send_bid_to_db(the_bid['izn'], the_bid['root'], int(the_bid['bid_amt']))
					update_balance(the_bid['izn'], citi_izhk - int(the_bid['bid_amt']))
					citi_izhk -= int(the_bid['bid_amt'])

				citi_bids = get_bids_for_citizen(the_bid['izn'])
				
				book = {'success': success, 'izn': the_bid['izn'], 'nbal': str(citi_izhk), 'bid': citi_bids }

				return jsonify(book)
			elif the_bid['purpose'] == 'disp_roots':
				roots_list = get_roots_from_db()
				return jsonify(roots_list)
			elif the_bid['purpose'] == 'authPM':
				auth = mongo.db.admin.find_one_or_404()

				if the_bid['password'] == auth['password']:
					resp = make_response(redirect(url_for('admin')))
					resp.set_cookie('auth', 'True')
					return resp
				else:
					resp = make_response(render_template('index.html'))
					resp.set_cookie('auth', 'False')
					return resp
		else:
			resp = make_response(render_template('index.html'))
			resp.set_cookie('auth', 'False')
			return resp
	elif request.method == 'GET':
		resp = make_response(render_template('index.html'))
		resp.set_cookie('auth', 'False')
		return resp

def get_izhk_balance(izn):
	try:
		citizen = mongo.db.citizens.find_one_or_404({"iz":izn})
		if citizen is not None:
			return citizen['izhk']
	except Exception as e:
		new_citizen = mongo.db.citizens.insert({"iz":izn,"izhk":100})
		return get_izhk_balance(izn)

def update_balance(izn, new_bal):
	updated_citizen = mongo.db.citizens.find_one_and_update({"iz":izn},{"$set":{"izhk":new_bal}},upsert=True) 

def update_bid(izn, root, new_bal):
	updated_bid = mongo.db.bids.find_one_and_update({"izn":izn, "root":root},{"$set":{"bid_amt":new_bal}}, upsert=True)

def send_bid_to_db(izn,root,bid_amt):
	mongo.db.bids.insert({"izn":izn,"root":root,"bid_amt":bid_amt})

def get_bids_for_citizen(izn):
	bids = mongo.db.bids.find({"izn":izn})
	bids_list=[]

	for bid in bids:
		bids_list.append({'root':bid['root'],'bid_amt':bid['bid_amt']})

	return bids_list

def replace_bid(izn, root):
	bids_list = get_bids_for_citizen(izn)

	for item in bids_list:
		if item['root'] == root:
			return True

	return False


@app.route('/admin', methods = ['GET', 'POST'])
def admin():
	if request.method == 'POST' and request.cookies.get('auth') == 'True':
		if request.data:
			seek = json.loads(request.data)

			if seek['purpose'] == 'update_roots':
				if seek['add']:
					send_root_to_db(seek['add'])

				if seek['del']:
					del_root_from_db(seek['del'])

				roots_list = get_roots_from_db()

				return jsonify(roots_list)
			elif seek['purpose'] == 'show_roots_bids':
				bids_list = get_bids_for_all()

				roots_list = get_roots_from_db()

				book = {'bid': bids_list, 'roots': roots_list}
				
				return jsonify(book)
			elif seek['purpose'] == 'del_bid_from_db':
				del_bid_from_db(seek['the_bid'])
				return "is deleted"
		else:
			return render_template('admin.html')
	elif request.method =='GET' and request.cookies.get('auth') == 'True':
		return render_template('admin.html')
	else:
		return redirect(url_for('index'))

def send_root_to_db(root):
	mongo.db.roots.insert({"root":root})

def del_root_from_db(root):
	mongo.db.roots.remove({"root":root})

def get_roots_from_db():
	roots = mongo.db.roots.find({})
	roots_list = []

	for root in roots:
		roots_list.append({'root':root['root']})

	return roots_list

def get_bids_for_all():
	bids = mongo.db.bids.find({})
	bids_list=[]

	for bid in bids:
		bids_list.append({'izn':bid['izn'],'root':bid['root'],'bid_amt':bid['bid_amt']})

	return bids_list

def del_bid_from_db(bid):
	mongo.db.bids.remove({"root": bid['root'], "izn": bid['izn'], "bid_amt": bid['bid_amt']})
	refund_citizen(bid['izn'], bid['bid_amt'])

def refund_citizen(izn, old_amt):
	new_amt = get_izhk_balance(izn)
	update_balance(izn, new_amt + old_amt)


if __name__ == '__main__':
	from gevent import pywsgi
	from geventwebsocket.handler import WebSocketHandler
	server = pywsgi.WSGIServer(('', 8000), app, handler_class = WebSocketHandler)
	server.serve_forever()
	app.run()