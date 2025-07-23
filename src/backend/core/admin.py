from django.contrib import admin

# Register your models here.
admin.site.site_header = "PromtHub Admin"


class CoreAdmin(admin.ModelAdmin):
    """
    Admin class for managing the CoreModel.

    This class provides customization for the Django admin interface to
    manage the CoreModel. It defines actions, ordering, and sets
    fields as readonly or changeable based on certain conditions.

    Attributes:
        actions (tuple):
            A tuple of custom admin actions. In this case,
            there is only one action, "my_custom_function".
        ordering (tuple):
            A tuple specifying the default ordering of
            objects in the admin interface, using the "state" field
            followed by the "time_created" field.
        base_readonly (tuple):
            A tuple of fields that should be readonly
            in the admin interface. These fields are common across all
            CoreModel instances and cannot be changed after creation.
        base_fields (tuple):
            A tuple of fields that are used as the base
            set of fields for all CoreModel instances. These fields
            are common across all instances.
        custom_fields (list):
            A list of custom fields that may be used
            in the admin interface.
        change_fields (list):
            A list of fields that can be changed after
            creation of the CoreModel instance.
        fields_to_export (tuple | list):
            A list the fields you want to export to csv

    Methods:
        save_model(self, request, obj, form, change):
            Saves the CoreModel instance after modification.

        export_selected_to_csv(self, request, queryset):
            Admin action that export selected objects to csv.

        get_state(self, obj):
            Retrieves the state of the CoreModel instance.

        get_readonly_fields(self, request, obj=None) -> list:
            Retrieves the readonly fields based on the state of the
            CoreModel instance.
    """

    custom_fields: list = []
    change_fields: list = []
    # ordering = ("state")
    base_readonly = (
        "soft_delete",
        "time_created",
        "time_updated",
        "time_deleted",
        "user_created",
        "user_updated",
        "user_deleted",
    )
    base_fields = (
        "time_created",
        "time_updated",
        "time_deleted",
        "user_created",
        "user_updated",
        "user_deleted",
        "soft_delete",
    )

    def save_model(self, request, obj, form, change):
        """
        Save the CoreModel instance after modification.

        This method is called when a CoreModel instance is saved
        in the admin interface. It automatically sets the "user_created"
        and "user_updated" fields based on the request user.

        Args:
            request (HttpRequest):
                The HTTP request object.
            obj (CoreModel):
                The CoreModel instance being saved.
            form (ModelForm):
                The form used to modify the instance.
            change (bool):
                A boolean indicating if this is an existing
                instance being changed or a new one being created.

        Returns:
            None
        """
        if not obj.user_created:
            obj.user_created = request.user
            obj.user_updated = request.user
        else:
            obj.user_updated = request.user
        super(CoreAdmin, self).save_model(request, obj, form, change)

    def get_readonly_fields(self, request, obj=None) -> list:
        """
        Retrieve the readonly fields based on the state of
        the CoreModel instance.

        This method is called to determine the readonly fields for
        the admin interface based on the state of the CoreModel instance.

        Args:
            request (HttpRequest):
                The HTTP request object.
            obj (CoreModel, optional):
                The CoreModel instance.
                Defaults to None.

        Returns:
            list: A list of readonly fields.
        """

        # if self.has_view_permission(request, obj):
        # basde_readonly = CoreModel.model._meta.get_fields()
        if obj and self.change_fields and obj.time_created:
            return [
                field.name
                for field in (*self.model._meta.get_fields(),)
                if field.name not in self.change_fields
            ] + [*self.base_readonly, *self.custom_fields]

        return [*self.readonly_fields, *self.base_readonly, *self.custom_fields]
