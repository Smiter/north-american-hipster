from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView
from django.contrib import admin
from django.conf import settings
from mainsite import views as mainsite_views
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', TemplateView.as_view(template_name='index.html'), name="home"),
    url(r'^dashboard', mainsite_views.dashboard),
    url(r'^admin/', include(admin.site.urls)),
    (r'^site_media/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.STATIC_ROOT}),
    url(r'^(?P<hubname>\w+)/$', mainsite_views.view_hub),
    url(r'^(?P<hubname>\w+)/edit$', mainsite_views.edit_hub),
)
