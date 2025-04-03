from langchain.agents import Tool
import requests

class StartChallengeAPI:
    name = "start_challenge"
    description = "Starts a new challenge with the given data"
    
    def __init__(self, api_url: str):
        self.api_url = api_url
        
    def run(self, challenge_data):
        # Calls the API to start a challenge with the given data
        response = requests.post(self.api_url, json=challenge_data)
        return response.json()  # Returns the response from the API

class GetProgressAPI:
    name = "get_progress"
    description = "Gets the progress of a challenge by its ID"
    
    def __init__(self, api_url: str):
        self.api_url = api_url
        
    def run(self, challenge_id):
        # Calls the API to get the progress of a given challenge
        response = requests.get(f"{self.api_url}/{challenge_id}")
        return response.json()  # Returns the progress data

def get_start_challenge_tool(api_url):
    tool = StartChallengeAPI(api_url)
    return Tool(
        name=tool.name,
        func=tool.run,
        description=tool.description
    )

def get_progress_tool(api_url):
    tool = GetProgressAPI(api_url)
    return Tool(
        name=tool.name,
        func=tool.run,
        description=tool.description
    )
