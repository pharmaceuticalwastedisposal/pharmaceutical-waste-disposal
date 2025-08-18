# Setting Up Bland.ai Inbound Calls

## Manual Setup Instructions:

### Step 1: Get Your Bland.ai Webhook URL

1. Go to: https://app.bland.ai/
2. Log in with your account
3. Look for one of these sections:
   - "Inbound" 
   - "Phone Numbers"
   - "Webhooks"
   - "Integrations"

4. Create a new inbound agent with these settings:

**Agent Name:** Pharmaceutical Waste Specialist
**Voice:** Maya (or your preference)
**First Message:** "Thank you for calling Pharmaceutical Waste Disposal, this is Sarah. How can I help you today?"

**System Prompt:**
```
You are Sarah, a senior pharmaceutical waste disposal specialist.

Handle these types of calls:
- Quote requests: Collect company name, facility type, waste types, volume, ZIP code
- Compliance questions: Provide helpful EPA/DEA compliance information
- Emergency pickups: Assure same-day service and get location
- General inquiries: Explain services and benefits

Key points to mention:
- EPA certified and DEA registered
- Serve all 50 states
- 30-40% savings vs competitors
- Same-day emergency pickup
- 100% compliance guarantee

Transfer calls to +1-912-536-6544 if requested.
```

5. Once created, Bland.ai will give you a webhook URL that looks like:
   - `https://api.bland.ai/webhook/YOUR_UNIQUE_ID`
   - or `https://inbound.bland.ai/YOUR_UNIQUE_ID`

### Step 2: Configure Twilio

1. Go to: https://console.twilio.com/console/phone-numbers/incoming
2. Click on: **+1-855-592-4560**
3. In "Voice Configuration":
   - **Configure With:** Webhooks
   - **A Call Comes In:** Webhook
   - **URL:** [Paste Bland.ai webhook URL here]
   - **HTTP Method:** POST
4. Click **Save Configuration**

### Step 3: Test

Call +1-855-592-4560 and the AI should answer!

## Alternative: Get Bland Support

If you can't find the webhook URL:
1. Email: support@bland.ai
2. Ask: "How do I get the webhook URL for Twilio to forward calls to my Bland.ai inbound agent?"

They typically respond quickly with exact instructions.