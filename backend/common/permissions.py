from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminRole(BasePermission):
	"""Allow access only to users with role 'ADMIN'."""

	def has_permission(self, request, view):
		user = request.user
		return bool(user and user.is_authenticated and getattr(user, "role", "").upper() == "ADMIN")


class IsAssignedAgentOrAdmin(BasePermission):
	"""Object-level permission to allow admins full access, agents only to assigned objects.

	Assumes the object has an `assigned_agent` attribute referencing the User.
	"""

	def has_permission(self, request, view):
		return bool(request.user and request.user.is_authenticated)

	def has_object_permission(self, request, view, obj):
		user = request.user
		if not user or not user.is_authenticated:
			return False
		if getattr(user, "role", "").upper() == "ADMIN":
			return True
		# Agent can access only if assigned_agent matches the user
		assigned = getattr(obj, "assigned_agent", None)
		return assigned is not None and assigned == user
