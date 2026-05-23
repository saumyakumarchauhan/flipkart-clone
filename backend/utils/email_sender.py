import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

# Load environment variables from your .env file
load_dotenv()

# --- FETCH CREDENTIALS SECURELY FROM .ENV ---
SENDER_EMAIL = os.getenv("EMAIL_USER") 
APP_PASSWORD = os.getenv("EMAIL_PASS")

# --- PRODUCTION READY URL SETUP ---
# Tip: You can also move this to your .env file later when you deploy
BASE_URL = os.getenv("FRONTEND_URL", "http://localhost:5173") 

def send_order_confirmation_email(receiver_email: str, user_name: str, order_number: str, total_amount: float, items: list):
    # Safety check so the server doesn't crash if .env variables are missing
    if not SENDER_EMAIL or not APP_PASSWORD:
        print("Warning: Email credentials not found in .env. Skipping email.")
        return

    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = receiver_email
        msg['Subject'] = f"Order Confirmed! Your Flipkart Order {order_number}"

        items_html = ""
        for item in items:
            
            raw_url = item.product.image_url or ""
            
            # --- SMART URL BUILDER ---
            if raw_url.startswith("/"):
                image_url = f"{BASE_URL}{raw_url}"
            else:
                image_url = raw_url
            
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

        html_content = f"""
        <!DOCTYPE html>
        <html>
            <body style="font-family: 'Roboto', Arial, sans-serif; background-color: #f1f3f6; padding: 30px 0; margin: 0;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    
                    <tr>
                        <td style="background-color: #2874f0; padding: 25px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-style: italic; letter-spacing: 1px;">Flipkart</h1>
                            <p style="color: #ffffff; font-size: 13px; margin: 5px 0 0 0; opacity: 0.9;">Explore <span style="color: #ffe500; font-weight: bold;">Plus</span> ✦</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 40px 30px;">
                            <div style="text-align: center; margin-bottom: 35px;">
                                <div style="background-color: #e6f3e6; color: #388e3c; width: 64px; height: 64px; border-radius: 50%; display: inline-block; line-height: 64px; font-size: 32px; margin: 0 auto 15px auto;">✓</div>
                                <h2 style="color: #212121; font-size: 24px; margin: 0 0 10px 0;">Order Placed Successfully!</h2>
                                <p style="color: #878787; font-size: 15px; margin: 0; line-height: 1.5;">Hi {user_name}, thanks for shopping with us. We're preparing your order right now.</p>
                            </div>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f7fa; border-left: 4px solid #2874f0; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0; color: #878787; font-size: 12px; text-transform: uppercase; font-weight: bold;">Order ID</p>
                                        <p style="margin: 5px 0 0 0; color: #212121; font-weight: bold; font-size: 16px;">{order_number}</p>
                                    </td>
                                    <td align="right" style="padding: 20px;">
                                        <a href="{BASE_URL}/orders" style="background-color: #2874f0; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 2px; font-weight: bold; font-size: 14px; display: inline-block;">Track Order</a>
                                    </td>
                                </tr>
                            </table>

                            <h3 style="color: #212121; font-size: 18px; margin: 0 0 15px 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Order Summary</h3>
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                                {items_html}
                                
                                <tr>
                                    <td colspan="2" style="padding: 15px 15px 5px 15px; text-align: right; color: #878787; font-size: 14px;">Subtotal:</td>
                                    <td style="padding: 15px 0 5px 15px; text-align: right; color: #212121; font-size: 14px;">₹{total_amount}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="padding: 5px 15px 15px 15px; text-align: right; color: #878787; font-size: 14px;">Delivery:</td>
                                    <td style="padding: 5px 0 15px 15px; text-align: right; color: #388e3c; font-size: 14px; font-weight: bold;">FREE</td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="padding: 20px 15px; text-align: right; font-weight: bold; font-size: 18px; color: #212121; border-top: 2px solid #f0f0f0;">Total Amount:</td>
                                    <td style="padding: 20px 0; text-align: right; font-weight: bold; font-size: 22px; color: #2874f0; border-top: 2px solid #f0f0f0;">₹{total_amount}</td>
                                </tr>
                            </table>

                            <p style="color: #878787; font-size: 12px; text-align: center; margin-top: 40px; border-top: 1px solid #f0f0f0; padding-top: 20px;">
                                This is an automated email from your Flipkart Clone project.<br>
                                © 2026 Flipkart Clone. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
        """

        msg.attach(MIMEText(html_content, 'html'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"Premium Email successfully sent to {receiver_email}!")
        
    except Exception as e:
        print(f"Failed to send email: {e}")