from django.shortcuts import render_to_response, redirect
from pymongo import MongoClient
from django.http import HttpResponse
from django.template import RequestContext
import json

client = MongoClient()
db = client.socialdb
hubs = db.hubs

SUPPORTED_SOCIAL = ["twitter", "facebook", "instagram"]

def dashboard(request):
    return render_to_response('dashboard.html', {"result": hubs.find()}, context_instance=RequestContext(request))

def view_hub(request, hubname):
    return render_to_response('view_hub.html', {"hubname": hubname}, context_instance=RequestContext(request))

def edit_hub(request, hubname):
    hub = hubs.find_one({"hubname": hubname})
    social_accounts = []
    for i in hub.items():
        if i[0] in SUPPORTED_SOCIAL:
            social_accounts.append(i)
    return render_to_response('edit_hub.html', {"hubname": hubname, "social_accounts": social_accounts},
                              context_instance=RequestContext(request))

def add_social_account(request):
    if request.method == "POST":
        is_values_empty = bool([param for param in request.POST.values() if param == ""])
        if not is_values_empty:
            doc = hubs.update({"hubname": request.POST['hubname']}, {"$set": {request.POST['social_name']: request.POST['account_name']}})
            if doc:
                return HttpResponse(json.dumps({"msg": "success"}), mimetype='application/json')
    return HttpResponse(json.dumps({"msg": "fail"}), mimetype='application/json')


def remove_social_account(request):
    if request.method == "POST":
        is_values_empty = bool([param for param in request.POST.values() if param == ""])
        if not is_values_empty:
            doc = hubs.update({"hubname": request.POST['hubname']}, {"$unset": {request.POST['social_name']: 1}})
            if doc:
                return HttpResponse(json.dumps({"msg": "success"}), mimetype='application/json')
    return HttpResponse(json.dumps({"msg": "fail"}), mimetype='application/json')
    

def add_hub(request):
    if request.method == "POST":
        hub = hubs.find_one({"hubname": request.POST['hubname']})
        if not hub:
            new_hub = hubs.insert({"hubname": request.POST['hubname']})
            if new_hub:
                return HttpResponse(json.dumps({"msg": "success"}), mimetype='application/json')
        else:
            return HttpResponse(json.dumps({"msg": "exists"}), mimetype='application/json')
    return HttpResponse(json.dumps({"msg": "fail"}), mimetype='application/json')


def remove_hub(request):
    if request.method == "POST":
        hub = hubs.find_one({"hubname": request.POST['hubname']})
        if hub:
            removed = hubs.remove({"hubname": request.POST['hubname']})
            if removed:
                return HttpResponse(json.dumps({"msg": "success"}), mimetype='application/json')
    return HttpResponse(json.dumps({"msg": "fail"}), mimetype='application/json')

def reject_post(request):
    if request.method == "POST":
        posts = request.POST['hubname']
        res = db[posts].update({'_id': request.POST['post_id']}, {'$set': {'accepted': 0}})
        if False:
            return HttpResponse(json.dumps({"msg": "success"}), mimetype='application/json')
    return HttpResponse(json.dumps({"msg": "fail"}), mimetype='application/json')

def accept_post(request):
    if request.method == "POST":
        posts = request.POST['hubname']
        res = db[posts].update({'_id': request.POST['post_id']}, {'$set': {'accepted': 1}})
        if res:
            return HttpResponse(json.dumps({"msg": "success"}), mimetype='application/json')
    return HttpResponse(json.dumps({"msg": "fail"}), mimetype='application/json')


