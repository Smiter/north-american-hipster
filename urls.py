from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView
from django.contrib import admin
from django.conf import settings
from mainsite import views as mainsite_views
from django.contrib.auth import views as auth_views
from registration.forms import RegistrationFormUniqueEmail
from registration.backends.default.views import RegistrationView
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', TemplateView.as_view(template_name='index.html'), name="home"),
    url(r'^accounts/login/$', auth_views.login, {'template_name': 'registration/login.html'},
        name='auth_login'),
    url(r'^accounts/logout/$', auth_views.logout, {'template_name': 'registration/logout.html'},
        name='auth_logout'),
    url(r'^accounts/register/$', RegistrationView.as_view(form_class=RegistrationFormUniqueEmail),
        name='registration_register'),
    url(r'^accounts/', include('registration.backends.default.urls')),
    url(r'^dashboard', mainsite_views.dashboard),
    url(r'^admin/', include(admin.site.urls)),
    (r'^site_media/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.STATIC_ROOT}),
    url(r'^(?P<hubname>.+)/$', mainsite_views.view_hub),
    url(r'^(?P<hubname>.+)/edit$', mainsite_views.edit_hub),
    url(r'^add-social-account$', mainsite_views.add_social_account),
    url(r'^remove-social-account$', mainsite_views.remove_social_account),
    url(r'^add-hub$', mainsite_views.add_hub),
    url(r'^remove-hub$', mainsite_views.remove_hub),
    
)
