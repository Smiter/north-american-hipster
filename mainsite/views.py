from django.shortcuts import render_to_response
from pymongo import MongoClient
from django.http import HttpResponse
import json

client = MongoClient()
db = client.socialdb
hubs = db.hubs

SUPPORTED_SOCIAL = ["twitter", "facebook", "instagram"]

def dashboard(request):
    return render_to_response('dashboard.html', {"result": hubs.find()})

def view_hub(request, hubname):
    return render_to_response('view_hub.html', {"hubname": hubname}) 

def edit_hub(request, hubname):
    hub = hubs.find_one({"hubname": hubname})
    social_accounts = []
    for i in hub.items():
        if i[0] in SUPPORTED_SOCIAL:
            social_accounts.append(i)
    return render_to_response('edit_hub.html', {"hubname": hubname, "social_accounts": social_accounts})    

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
    