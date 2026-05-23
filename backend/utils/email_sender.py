import os
import resend
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Resend with your API Key
resend.api_key = os.getenv("RESEND_API_KEY")

# URL for tracking links in email
BASE_URL = os.getenv("FRONTEND_URL", "http://localhost:5173") 

def send_order_confirmation_email(receiver_email: str, user_name: str, order_number: str, total_amount: float, items: list):
    print(f"DEBUG: STARTING RESEND EMAIL TO {receiver_email}")
    
    if not resend.api_key:
        print("DEBUG: ERROR - RESEND_API_KEY missing from Environment Variables!")
        return

    # Build the HTML items list
    items_html = ""
    for item in items:
        raw_url = item.product.image_url or ""
        image_url = f"{BASE_URL}{raw_url}" if raw_url.startswith("/") else raw_url
        
        items_html += f"""
        <tr>
            <td width="70" style="padding: 15px 0; border-bottom: 1px solid #e0e0e0; vertical-align: middle;">
                <img src="{image_url}" alt="{item.product.name}" width="60" height="60" style="display: block; border: 1px solid #f0f0f0; border-radius: 4px; padding: 2px; background: white; object-fit: contain;" />
            </td>
            <td style="padding: 15px 10px; border-bottom: 1px solid #e0e0e0; vertical-align: middle;">
                <p style="margin: 0; font-size: 14px; color: #212121; font-weight: bold;">{item.product.name}</p>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #878787;">Qty: {item.quantity}</p>
            </td>
            <td width="100" align="right" style="padding: 15px 0; border-bottom: 1px solid #e0e0e0; font-size: 16px; color: #212121; font-weight: bold; vertical-align: middle;">
                ₹{item.product.price * item.quantity}
            </td>
        </tr>
        """

    # Full Email Template
    html_content = f"""
    <!DOCTYPE html>
    <html>
        <body style="font-family: 'Roboto', Arial, sans-serif; background-color: #f1f3f6; padding: 30px 0; margin: 0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <tr>
                    <td style="background-color: #2874f0; padding: 25px 30px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-style: italic; letter-spacing: 1px;">Flipkart</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 40px 30px;">
                        <h2 style="color: #212121; font-size: 24px;">Order Placed Successfully!</h2>
                        <p style="color: #878787; font-size: 15px;">Hi {user_name}, thanks for shopping with us.</p>
                        
                        <h3 style="color: #212121;">Order ID: {order_number}</h3>
                        <table width="100%">{items_html}</table>
                        
                        <p style="font-weight: bold; font-size: 18px;">Total Amount: ₹{total_amount}</p>
                    </td>
                </tr>
            </table>
        </body>
    </html>
    """

    # Send using Resend API
    params = {
        "from": "Flipkart Clone <onboarding@resend.dev>",
        "to": receiver_email,
        "subject": f"Order Confirmed! Your Flipkart Order {order_number}",
        "html": html_content
    }

    try:
        response = resend.Emails.send(params)
        print(f"DEBUG: Email sent successfully! Resend ID: {response['id']}")
    except Exception as e:
        print(f"DEBUG: CRITICAL ERROR! {str(e)}")