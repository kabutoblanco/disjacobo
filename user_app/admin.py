from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import ugettext_lazy as _
from .models import User, Employee, Client, Provider, Adviser

# Register your models here.


class Admin(BaseUserAdmin):
    fieldsets = (
        (None, {"fields": ("username", "email", "password")}),
        (
            _("Personal info"),
            {"fields": ("type_id", "type_legal_nature", "personal_id", "first_name", "last_name",
                        "cellphone", "telephone", "address", "neighborhod", "country", "government", "city")},
        ),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "username",
                    "password1",
                    "password2",
                    "is_superuser",
                    "is_staff",
                ),
            },
        ),
    )
    list_display = ("id", "username", "is_staff")
    search_fields = ("email", "first_name", "last_name")
    ordering = ("username",)


admin.site.register(User, Admin)
admin.site.register(Employee)
admin.site.register(Client)
admin.site.register(Provider)
admin.site.register(Adviser)
