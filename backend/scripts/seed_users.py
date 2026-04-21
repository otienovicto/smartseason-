from apps.users.models import CustomUser

if not CustomUser.objects.filter(username="otieno").exists():
    CustomUser.objects.create_user(
        username="otieno",
        password="0284",
        email="otieno@gmail.com",
        role="ADMIN"
    )

print("User seeded")