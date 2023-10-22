from core.models.base import BaseModel
from django.db import models
import uuid

class UserAccount(models.Model):
    """Model/Manager for service accounts"""
    
    GitHub="GitHub"
    GitLab="GitLab"

    ACCOUNT_TYPES = (
    (GitHub, "github"),
    (GitLab, "gitlab"))

    id=models.UUIDField(
        primary_key=True, 
        default=uuid.uuid4, 
        editable=False,
        unique=True)
    
    #github id
    account_id=models.CharField(
        max_length=255);
    
    access_token=models.CharField(  
        max_length=255,
        default="");

    email=models.CharField(
        max_length=255);
    
    account_type=models.CharField(
        choices=ACCOUNT_TYPES,
        default="GitHub",
        max_length=255);
    
    user_name=models.CharField(
        max_length=255);
    
    name=models.CharField(
        max_length=255);
    
    company=models.CharField(
        max_length=255);
    
    created_at=models.DateTimeField(
        auto_now=True);
    
    updated_at=models.DateTimeField();
    
    class Meta:
        db_table = "UserAccount"
