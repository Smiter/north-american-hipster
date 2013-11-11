from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView
from django.contrib import admin
from django.conf import settings
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', TemplateView.as_view(template_name='index.html'), name="home"),
    url(r'^dashboard/', TemplateView.as_view(template_name='dashboard.html'), name="dashboard"),
    url(r'^admin/', include(admin.site.urls)),
    (r'^site_media/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.STATIC_ROOT}),
)
