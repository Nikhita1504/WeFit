from flask import Flask, request, jsonify
from flask_cors import CORS
import re
from agent import initialize_agentic_ai  # Import the agent initialization function

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('user_input')
    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    # Initialize the agent or set up default response
    agent = initialize_agentic_ai()

    # Step 1: Send the user's input to the LLM to decide the action
    llm_response = agent.run(user_input)  # Let the LLM decide based on the input

    # Step 2: Based on LLM response, determine if it's a challenge-related request or casual talk
    if "start challenge" in llm_response.lower():
        # Extract challenge ID and stake amount if needed
        challenge_id = extract_challenge_id(user_input)
        response = f"Selected challenge {challenge_id}. How much would you like to stake?"

    elif "select challenge" in llm_response.lower():
        # Extract challenge ID
        challenge_id = extract_challenge_id(user_input)
        response = f"How much would you like to stake for challenge {challenge_id}?"

    elif "confirm stake" in llm_response.lower():
        # Handle stake confirmation logic
        stake_amount = extract_stake_amount(user_input)
        response = f"Your stake amount is {stake_amount}. Confirm to proceed?"

    # Step 3: General conversation (if not related to challenge)
    else:
        response = llm_response  # General response from the LLM

    return jsonify({"response": response})

def extract_challenge_id(user_input):
    """
    This function extracts the challenge ID from the user's input.
    Example input: 'select challenge 5' or 'start challenge 3'
    It returns the challenge ID (e.g., '5' or '3').
    """
    import re
    match = re.search(r"(?:select|start)\s+challenge\s+(\d+)", user_input.lower())
    if match:
        return int(match.group(1))
    else:
        raise ValueError("Challenge ID not found in the input.")

def extract_stake_amount(user_input):
    """
    This function extracts the stake amount from the user's input.
    Example input: 'I want to stake 100' or 'stake 50 for challenge'
    It returns the stake amount (e.g., 100 or 50).
    """
    import re
    match = re.search(r"\bstake\s+(\d+)", user_input.lower())
    if match:
        return int(match.group(1))
    else:
        raise ValueError("Stake amount not found in the input.")

if __name__ == '__main__':
    app.run(debug=True)