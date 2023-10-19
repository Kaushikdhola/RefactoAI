from django.db import models

from core.utils.exceptions import ValidationError


class BaseModel(models.Model):
    """Base models with all the common utils"""

    fields_to_ignore = []

    class Meta:
        abstract = True

    @classmethod
    def get(cls, ExceptionToRaise=ValidationError, **filters):
        """get the class instance throw the error if does not exists"""
        try:
            return cls.objects.get(**filters)
        except (cls.DoesNotExist, cls.MultipleObjectsReturned) as e:
            raise ExceptionToRaise(
                "Instance does not exists or multiple instances found", status=400
            ) from e

    def before_save(self, *args, **kwargs):
        """before_save method which will be triggered before save"""
        pass

    def after_save(self, *args, **kwargs):
        """after_save method which will be triggered before save"""
        pass

    def save(self, *args, **kwargs):
        """common save where we can trigger few events before and after save"""
        self.before_save(*args, **kwargs)
        super().save(*args, **kwargs)
        self.after_save(*args, **kwargs)
        return self

    def set_values(self, values):
        """assign values from dict to object"""
        if not values or not isinstance(values, dict):
            return self

        to_update = {f: v for f, v in values.items() if f not in self.fields_to_ignore}
        for field, value in to_update.items():
            setattr(
                self,
                field,
                value.strip() if isinstance(value, str) else value,
            )
        return self
