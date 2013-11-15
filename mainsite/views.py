from django.shortcuts import render
from django.template import RequestContext
from django.shortcuts import render_to_response
from pymongo import MongoClient

def dashboard(request):
    result = [{'hubname': 'atlanta'}, {'hubname': 'mexico'}]
    return render_to_response('dashboard.html', {"result": result})

