from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class CoreModel(models.Model):

    soft_delete = models.BooleanField(default=False)

    time_created = models.DateTimeField(
        _("creation time"),
        # auto_now_add=True,
        null=True, blank=True
    )
    time_updated = models.DateTimeField(
        _("update time"), auto_now=True, editable=False,
        null=True, blank=True
    )
    time_deleted = models.DateTimeField(
        _("deleted time"), editable=False,
        null=True, blank=True
    )

    user_created = models.ForeignKey(
        'auth.User', verbose_name=_("created by user"),
        editable=False, null=True, blank=True,
        related_name="+", on_delete=models.SET_NULL
    )
    user_updated = models.ForeignKey(
        'auth.User', verbose_name=_("updated by user"),
        editable=False, null=True, blank=True,
        related_name="+", on_delete=models.SET_NULL
    )
    user_deleted = models.ForeignKey(
        'auth.User', verbose_name=_("deleted by user"),
        editable=False, null=True, blank=True,
        related_name="+", on_delete=models.SET_NULL
    )

    class Meta:
        abstract = True

    def delete(self, soft=True, *args, **kwargs):
        """
        Soft-delete or hard-delete the object based on 'Soft' parameter.

        This method allows soft-deleting the object by marking it as removed
        and setting the 'time_deleted' attribute. If 'soft' parameter is False,
        the object is hard-deleted from the database.

        Args:
            soft (bool): A boolean indicating whether to soft-delete the
                object (default is True).

        Returns:
            None
        """

        if settings.DEBUG:
            soft = False

        if soft:
            # soft-delete instance
            self.soft_delete = True
            self.time_deleted = timezone.now()
            self.save()
        else:
            # delete from DB
            super().delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        """
        Save the object and update common attributes.

        This method overrides the default save method to update the 'published'
        and 'removed' attributes based on the 'state' attribute. It also sets
        'time_created' and 'time_updated' if they are not already set.

        Returns:
            None
        """

        if not self.time_created:
            self.time_created = timezone.now()
            self.time_updated = timezone.now()
        else:
            self.time_updated = timezone.now()

        super().save(*args, **kwargs)
