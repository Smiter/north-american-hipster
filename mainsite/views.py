from django.shortcuts import render
from django.template import RequestContext
from django.shortcuts import render_to_response
from pymongo import MongoClient
client = MongoClient()
db = client.socialdb
hubs = db.hubs

def dashboard(request):
    return render_to_response('dashboard.html', {"result": hubs.find()})

def view_hub(request, hubname):
    return render_to_response('view_hub.html', {"hubname": hubname}) 

def edit_hub(request, hubname):
    return render_to_response('edit_hub.html', {"hubname": hubname})      
