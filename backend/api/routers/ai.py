from __future__ import annotations

import json
import httpx
from fastapi import APIRouter
from pydantic import BaseModel

from core.config import settings

# --- IMPORT THE EYES (Data Sources) ---
from api.routers.finance import finance_summary
from api.routers.trading import positions

router = APIRouter(prefix="/ai", tags=["ai"])

class ChatRequest(BaseModel):
    message: str

@router.get("/status")
def ai_status() -> dict:
    return {
        "assistant": "online",
        "model": "gemini-flash-latest",
        "capabilities": ["financial_vision", "task_creation"]
    }

@router.post("/chat")
async def chat(payload: ChatRequest) -> dict:
    if not settings.google_api_key:
        return {"response": "System Error: API Key is missing in .env file."}

    # 1. FETCH LIVE DATA (The AI "Looks" at your dashboard)
    try:
        fin_data = finance_summary()
        trad_data = positions()
    except Exception as e:
        return {"response": f"Internal Error reading financial data: {e}"}

    # 2. CREATE THE SYSTEM BRAIN
    # We teach it two things: 1) Read Data, 2) Use Tools
    system_context = f"""
    YOU ARE A FINANCIAL OPERATING SYSTEM AGENT.
    
    [LIVE DATA]
    - Cash: {fin_data['cash']['currency']} {fin_data['cash']['amount']}
    - Net Worth: {fin_data['net_worth']['currency']} {fin_data['net_worth']['amount']}
    - Portfolio: {trad_data['positions']}
    
    [YOUR TOOLKIT]
    You can now ACTUALLY perform actions.
    
    1. IF the user asks to "create", "add", "remind", or "schedule" a task:
       You MUST reply with ONLY a JSON object (no other text).
       Format: {{"tool": "create_task", "title": "The Task Title", "priority": 1}}
       
    2. IF the user asks a question:
       Just answer normally using the live data.
       
    Example 1 User: "Add a task to call mom"
    Example 1 You: {{"tool": "create_task", "title": "Call Mom", "priority": 1}}
    """

    final_prompt = f"{system_context}\n\nUSER QUESTION: {payload.message}"

    api_key = settings.google_api_key.strip()
    model_name = "gemini-flash-latest"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
    
    request_body = {
        "contents": [{
            "parts": [{"text": final_prompt}]
        }]
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=request_body, timeout=30.0)
            
            if response.status_code != 200:
                return {"response": f"Google Error ({response.status_code}): {response.text}"}
            
            data = response.json()
            answer_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()

            # --- THE AGENT LOGIC ---
            # We check: Did the AI give us a JSON command?
            if answer_text.startswith("{") and "create_task" in answer_text:
                try:
                    tool_cmd = json.loads(answer_text)
                    
                    # If valid command, let's EXECUTE it by calling our own API
                    if tool_cmd.get("tool") == "create_task":
                        new_task = {
                            "title": tool_cmd["title"],
                            "status": "todo",
                            "priority": tool_cmd.get("priority", 1)
                        }
                        
                        # Call the Productivity API (Loopback)
                        await client.post("http://127.0.0.1:8000/productivity/tasks", json=new_task)
                        
                        return {"response": f"✅ Done! I have added '{tool_cmd['title']}' to your task list."}
                except Exception as e:
                    # If parsing failed, just return the text
                    print(f"Tool execution failed: {e}")
            
            # If no tool was used, just return the normal answer
            return {"response": answer_text}

    except Exception as e:
        return {"response": f"Connection Error: {str(e)}"}