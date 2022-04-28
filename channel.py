from pydantic import BaseModel
from typing import List


#pydantic Base Model
class Channel(BaseModel):
    name              : str
    users             : List[str]