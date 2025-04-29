from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import os
from datetime import datetime
from typing import Any

from .schemas import EmailRequest
from .email_service import send_notification_emails

app = FastAPI(
    title="SureStrat Email API",
    description="API for sending notification emails for the Pineapple Transfer Form",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Welcome to SureStrat Email API", "status": "active"}


@app.get("/health")
def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "version": app.version,
    }


@app.post("/send-email")
async def send_email(
    email_request: EmailRequest, background_tasks: BackgroundTasks
):  # -> dict[str, Any]:# -> dict[str, Any]:
    try:
        # Extract data from request
        form_data: dict[str, Any] = email_request.formData.model_dump()
        agent_info: dict[str, Any] = email_request.agentInfo.model_dump()
        pine_client_id: str = email_request.pine_client_id
        url: str = email_request.url

        # Send email in background
        background_tasks.add_task(
            send_notification_emails, form_data, agent_info, pine_client_id, url
        )

        return {
            "success": True,
            "message": "Notification email(s) scheduled for delivery",
            "timestamp": datetime.now().isoformat(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
