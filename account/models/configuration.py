from core.models.base import BaseModel


class UserConfiguration(BaseModel):
    """Model/Manager for service accounts"""

    #id
    #number of commits intervals
    #number of lines
    #

    
    class Meta:
        db_table = "UserConfiguration"
