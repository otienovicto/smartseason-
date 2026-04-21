from django.db import models
from django.conf import settings
from django.db.models import Q
from django.utils import timezone


class Field(models.Model):
    STAGE_PLANTED = 'planted'
    STAGE_GROWING = 'growing'
    STAGE_READY = 'ready'
    STAGE_HARVESTED = 'harvested'
    STAGE_CHOICES = [
        (STAGE_PLANTED, 'Planted'),
        (STAGE_GROWING, 'Growing'),
        (STAGE_READY, 'Ready'),
        (STAGE_HARVESTED, 'Harvested'),
    ]

    name = models.CharField(max_length=255)
    crop_type = models.CharField(max_length=255)
    planting_date = models.DateField(null=True, blank=True)
    current_stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default=STAGE_PLANTED)
    assigned_agent = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='assigned_fields'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='created_fields'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    @property
    def status(self):
        """Compute field status (not stored in DB).

        Rules:
        - If current_stage is 'harvested' -> 'Completed'
        - If the stage hasn't changed in STALE_DAYS or notes contain risk keywords -> 'At Risk'
        - Otherwise -> 'Active'
        """
        STALE_DAYS = 14
        RISK_KEYWORDS = ("disease", "pest")

        # Completed when harvested
        if getattr(self, "current_stage", "").lower() == self.STAGE_HARVESTED:
            return "Completed"

        # If any recent notes contain risk keywords -> At Risk
        qs = self.updates.all()
        for kw in RISK_KEYWORDS:
            if qs.filter(notes__icontains=kw).exists():
                return "At Risk"

        # Find the most recent update that set the current stage
        last_stage_change = qs.filter(stage=self.current_stage).order_by("-created_at").first()
        last_changed = None
        if last_stage_change:
            last_changed = last_stage_change.created_at
        else:
            # fallback to when the field was created
            last_changed = getattr(self, "created_at", None)

        if last_changed is None:
            return "Active"

        # compute staleness
        delta = timezone.now() - last_changed
        if delta.days >= STALE_DAYS:
            return "At Risk"

        return "Active"


class FieldUpdate(models.Model):
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name='updates')
    agent = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='updates')
    stage = models.CharField(max_length=20, choices=Field.STAGE_CHOICES)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Update for {self.field.name} at {self.created_at}"

