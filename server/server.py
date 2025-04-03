from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from squat_counter import SquatCounter  # Import the updated class
import threading

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

socketio = SocketIO(app, cors_allowed_origins="*")

# Global reference to squat counter instance
squat_counter = None
processing_thread = None
display_thread = None

@app.route("/start_squat", methods=["GET"])
def start_squat():
    """Starts real-time squat tracking."""
    global squat_counter, processing_thread, display_thread
    
    # Stop any existing counter
    if squat_counter:
        squat_counter.stop()
        if processing_thread: processing_thread.join()
        if display_thread: display_thread.join()
    
    # Create and start new counter
    squat_counter = SquatCounter(socketio)
    processing_thread, display_thread = squat_counter.start()
    
    return jsonify({
        "message": "Squat tracking started",
        "status": "running"
    })

@app.route("/stop_squat", methods=["GET"])
def stop_squat():
    """Stops real-time squat tracking."""
    global squat_counter, processing_thread, display_thread
    
    if squat_counter:
        squat_counter.stop()
        if processing_thread: processing_thread.join()
        if display_thread: display_thread.join()
        squat_counter = None
        return jsonify({
            "message": "Squat tracking stopped",
            "status": "stopped"
        })
    return jsonify({
        "message": "No active squat tracking",
        "status": "inactive"
    })

@app.route("/get_count", methods=["GET"])
def get_count():
    """Gets current squat count."""
    if squat_counter:
        return jsonify({
            "count": squat_counter.counter,
            "status": "active"
        })
    return jsonify({
        "count": 0,
        "status": "inactive"
    })

if __name__ == "__main__":
    try:
        socketio.run(app, debug=True, port=3001, host="0.0.0.0")  # Run on port 5000
    finally:
        # Cleanup on server shutdown
        if squat_counter:
            squat_counter.stop()
            if processing_thread: processing_thread.join()
            if display_thread: display_thread.join()
