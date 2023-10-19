from core.models.base import BaseModel


class UserAccount(BaseModel):
    """Model/Manager for service accounts"""

    class Meta:
        db_table = "UserAccount"
