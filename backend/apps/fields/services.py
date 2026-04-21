"""Business logic for fields, including status computation."""

def compute_status(field):
    """Compute a simple status for a field.

    Rules (placeholder):
    - If stage is 'harvested' -> 'Completed'
    - If stage is 'planted' -> 'At Risk'
    - Otherwise -> 'Active'
    """
    stage = getattr(field, "current_stage", None)
    if stage == "harvested":
        return "Completed"
    if stage == "planted":
        return "At Risk"
    return "Active"
