from core.models.base import BaseModel
from django.db import models

class UserConfiguration(models.Model):
    """Model/Manager for service accounts"""

    id=models.UUIDField(
        primary_key=True,  
        editable=False,
        unique=True)
    
    commitsnum=models.IntegerField(
        editable=True)
    
    linesnum=models.IntegerField(
        editable=True)
    class Meta:
        db_table = "UserConfiguration"
