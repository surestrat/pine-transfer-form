import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Environment, FileSystemLoader, select_autoescape
from dotenv import load_dotenv
import os
from datetime import datetime
import requests
from typing import List

load_dotenv()

# Email configuration
SMTP_SERVER: str = os.getenv("SMTP_SERVER", "")
SMTP_PORT: int = int(os.getenv("SMTP_PORT", "465"))  # Default to 465 for SSL
SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
USE_SSL: bool = os.getenv("USE_SSL", "True").lower() in ("true", "1", "t")
DEFAULT_TEMPLATE_ID: int = int(os.getenv("DEFAULT_TEMPLATE_ID", "1"))

# Initialize Jinja2 environment
env = Environment(
    loader=FileSystemLoader("app/templates"),
    autoescape=select_autoescape(["html", "xml"]),
)


def send_email(
    recipient_emails: List[str], subject: str, template_name: str, template_data: dict
) -> bool:
    """
    Sends an email using the specified template and data.

    Args:
        recipient_emails: List of email addresses to send to
        subject: Email subject
        template_name: Name of the template file in the templates folder
        template_data: Dictionary of data to pass to the template

    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Get the template
        template = env.get_template(template_name)

        # Add current year to template data for copyright
        if "current_year" not in template_data:
            template_data["current_year"] = datetime.now().year

        # Render the HTML content
        html_content = template.render(**template_data)

        # Create message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = SMTP_USERNAME
        msg["To"] = ", ".join(recipient_emails)

        # Attach HTML content
        msg.attach(MIMEText(html_content, "html"))

        # Connect to SMTP server and send email using SSL
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)

        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


def send_notification_emails(
    recipients: List[str],
    subject: str,
    data: dict,
    template_name: str = "notification.html",
) -> bool:
    """
    Sends notification emails to the specified recipients.

    Args:
        recipients: List of email addresses to notify
        subject: Email subject line
        data: Dictionary containing data to be used in the notification template
        template_name: Name of the template file to use (defaults to notification.html)

    Returns:
        bool: True if all emails were sent successfully, False otherwise
    """
    return send_email(
        recipient_emails=recipients,
        subject=subject,
        template_name=template_name,
        template_data=data,
    )
