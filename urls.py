from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView
from django.contrib import admin
from django.conf import settings
from mainsite import views as mainsite_views
from users import views as user_views
from django.contrib.auth import views as auth_views
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', TemplateView.as_view(template_name='index.html'), name="home"),
    url(r'^accounts/login/$', user_views.login_or_redirect_if_already_in,
        {'redirect_to': 'dashboard'}, name='auth_login'),
    url(r'^accounts/logout/$', auth_views.logout, {'next_page': 'home'},
        name='auth_logout'),
    url(r'^accounts/register/$', user_views.register_or_redirect_if_already_in,
        {'redirect_to': 'dashboard'}, name='registration_register'),
    url(r'^accounts/', include('registration.backends.default.urls')),
    url(r'^dashboard', mainsite_views.dashboard, name='dashboard'),
    url(r'^admin/', include(admin.site.urls)),
    (r'^site_media/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.STATIC_ROOT}),
    url(r'^(?P<hubname>.+)/$', mainsite_views.view_hub),
    url(r'^(?P<hubname>.+)/edit$', mainsite_views.edit_hub),
    url(r'^add-social-account$', mainsite_views.add_social_account),
    url(r'^remove-social-account$', mainsite_views.remove_social_account),
    url(r'^add-hub$', mainsite_views.add_hub),
    url(r'^remove-hub$', mainsite_views.remove_hub),
    url(r'^reject-post$', mainsite_views.reject_post),
    url(r'^accept-post$', mainsite_views.accept_post),
    url(r'^pin-post$', mainsite_views.pin_post),
    url(r'^unpin-post$', mainsite_views.unpin_post),
    
)
