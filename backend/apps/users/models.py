from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    """Custom user for SmartSeason."""

    ROLE_CHOICES = (
        ("ADMIN", "Admin"),
        ("AGENT", "Field Agent"),
    )

    name = models.CharField("Full name", max_length=255, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="AGENT")
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.name or self.username
