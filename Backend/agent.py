from langchain.agents import initialize_agent, AgentType
from langchain.llms.base import LLM
import requests
from tools import get_start_challenge_tool, get_progress_tool

class GroqLLM(LLM):
    api_key: str
    API_URL: str = "https://api.groq.com/openai/v1/chat/completions"

    @property
    def _llm_type(self) -> str:
        return "groq"

    def _call(self, prompt: str, stop=None) -> str:
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        payload = {
            "model": "qwen-2.5-32b",  # Example model (replace with actual model)
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.3,
            "max_completion_tokens": 150,
            "top_p": 1,
            "stream": False,
            "stop": stop
        }
        response = requests.post(self.API_URL, json=payload, headers=headers)
        if response.status_code == 200:
            data = response.json()
            return data["choices"][0]["message"]["content"]
        else:
            return f"Error: {response.status_code} - {response.text}"

def initialize_agentic_ai():
    groq_api_key = "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"
    groq_llm = GroqLLM(api_key=groq_api_key)

    start_challenge_api_url = "http://localhost:3000/ActiveChallenge/create/${localStorage.getItem('JwtToken')}"
    get_progress_api_url = "http://localhost:3000/api/challenges/get"

    tools = [
        get_start_challenge_tool(start_challenge_api_url),
        get_progress_tool(get_progress_api_url)
    ]

    system_prompt = "Provide the output in JSON format only for perform operation."

    agent = initialize_agent(
        tools=tools,
        agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        llm=groq_llm,
        verbose=True,
        handle_parsing_errors=True,
        agent_kwargs={"system_message": system_prompt}
    )

    return agent
