from pydantic import BaseModel, EmailStr
from typing import List, Optional


class FormData(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    id_number: Optional[str] = None
    contact_number: str
    quote_id: Optional[str] = None


class AgentInfo(BaseModel):
    agent: str
    branch: str


class EmailRequest(BaseModel):
    formData: FormData
    agentInfo: AgentInfo
    pine_client_id: str
    url: str
