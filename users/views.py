from django.shortcuts import render_to_response, redirect
from django.contrib.auth.views import login
from registration.forms import RegistrationFormUniqueEmail
from registration.backends.default.views import RegistrationView
 
def login_or_redirect_if_already_in(request, **kwargs):
    redirect_to = kwargs.pop('redirect_to')
    if request.user.is_authenticated():
        return redirect(redirect_to, **kwargs)
    else:
        return login(request, **kwargs)

def register_or_redirect_if_already_in(request, **kwargs):
    redirect_to = kwargs.pop('redirect_to')
    if request.user.is_authenticated():
        return redirect(redirect_to, **kwargs)
    else:
        return RegistrationView.as_view(form_class=RegistrationFormUniqueEmail)(request, **kwargs)