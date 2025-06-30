from django.urls import path
from .views import profile_interpret_view



urlpatterns = [
    path('profile-interpret/', profile_interpret_view, name='profile_interpret'),
]