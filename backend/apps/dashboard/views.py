from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count

from apps.fields.models import Field, FieldUpdate


class DashboardView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        now = timezone.now()

        # Helper: compute status breakdown
        def status_counts(queryset):
            total = queryset.count()
            counts = {
                "total": total,
                "completed": queryset.filter(current_stage=Field.STAGE_HARVESTED).count(),
                "active": 0,
                "at_risk": 0,
            }

            # compute at-risk by using the Field.status property
            at_risk = 0
            active = 0
            for f in queryset:
                s = f.status
                if s == "At Risk":
                    at_risk += 1
                elif s == "Active":
                    active += 1

            counts["active"] = active
            counts["at_risk"] = at_risk
            return counts

        if getattr(user, "role", "").upper() == "ADMIN":
            fields_qs = Field.objects.all()
            updates_qs = FieldUpdate.objects.select_related("field", "agent").order_by("-created_at")[:10]
            data = {
                "total_fields": fields_qs.count(),
                "status_breakdown": status_counts(fields_qs),
                "recent_updates": [
                    {"id": u.id, "field": u.field.id, "stage": u.stage, "notes": u.notes, "agent": getattr(u.agent, "id", None), "created_at": u.created_at}
                    for u in updates_qs
                ],
            }
        else:
            # Agent dashboard: only assigned fields
            fields_qs = Field.objects.filter(assigned_agent=user)
            updates_qs = FieldUpdate.objects.filter(field__in=fields_qs).select_related("field", "agent").order_by("-created_at")[:10]
            data = {
                "assigned_fields": fields_qs.count(),
                "status_breakdown": status_counts(fields_qs),
                "recent_updates": [
                    {"id": u.id, "field": u.field.id, "stage": u.stage, "notes": u.notes, "agent": getattr(u.agent, "id", None), "created_at": u.created_at}
                    for u in updates_qs
                ],
            }

        return Response(data)
