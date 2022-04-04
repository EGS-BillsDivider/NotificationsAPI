from pydantic import BaseModel
from typing import List


#pydantic Base Model
class Notification(BaseModel):
    name          : str
    message       : str
    channels      : List[str] = None