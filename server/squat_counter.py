import cv2
import mediapipe as mp
import numpy as np
import time
from queue import Queue
import threading

mp_pose = mp.solutions.pose

class SquatCounter:
    def __init__(self, socketio):
        self.socketio = socketio
        self.frame_queue = Queue(maxsize=1)
        self.stop_event = threading.Event()
        self.counter = 0
        self.last_frame = None

    def calculate_angle(self, a, b, c):
        """Calculate the angle between three points."""
        a, b, c = np.array(a), np.array(b), np.array(c)
        radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
        angle = np.abs(radians * 180.0 / np.pi)
        return angle if angle <= 180 else 360 - angle

    def get_body_orientation(self, shoulder, hip):
        """Determines whether the body is horizontal or vertical."""
        return "vertical" if abs(shoulder[1] - hip[1]) > 0.3 else "horizontal"

    def process_frames(self):
        """Worker thread function to process frames."""
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("Error: Could not open video capture")
            return

        state, last_rep_time = "up", 0
        
        try:
            with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
                while not self.stop_event.is_set() and cap.isOpened():
                    success, image = cap.read()
                    if not success:
                        break

                    if image is None or image.size == 0:
                        continue

                    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                    results = pose.process(image_rgb)

                    if results.pose_landmarks:
                        landmarks = results.pose_landmarks.landmark

                        hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,
                               landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
                        knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,
                                landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
                        ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,
                                 landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]
                        shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                                    landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]

                        orientation = self.get_body_orientation(shoulder, hip)
                        if orientation == "vertical":
                            angle = self.calculate_angle(hip, knee, ankle)
                            print(f"Squat Angle: {angle}, Orientation: {orientation}")

                            current_time = time.time()
                            if state == "up" and angle < 105:
                                state = "down"
                            elif state == "down" and angle > 170:
                                if current_time - last_rep_time > 1:
                                    self.counter += 1
                                    last_rep_time = current_time
                                state = "up"

                            self.socketio.emit("squat_count", {"count": self.counter})

                    # Add counter text to frame
                    annotated_image = image.copy()
                    cv2.putText(annotated_image, f"Squats: {self.counter}", (50, 50), 
                               cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
                    
                    # Update the frame queue
                    if self.frame_queue.empty():
                        try:
                            self.frame_queue.put_nowait(annotated_image)
                        except:
                            pass
        finally:
            cap.release()

    def display_frames(self):
        """Main thread function to display frames."""
        cv2.namedWindow("Squat Counter", cv2.WINDOW_NORMAL)
        
        while not self.stop_event.is_set():
            try:
                if not self.frame_queue.empty():
                    frame = self.frame_queue.get_nowait()
                    self.last_frame = frame
                    cv2.imshow("Squat Counter", frame)
                
                # Check for window close or 'q' key
                if cv2.getWindowProperty("Squat Counter", cv2.WND_PROP_VISIBLE) < 1:
                    self.stop_event.set()
                    break
                
                key = cv2.waitKey(1) & 0xFF
                if key == ord('q'):
                    self.stop_event.set()
                    break
                    
            except Exception as e:
                print(f"Display error: {e}")
                self.stop_event.set()
                break
        
        cv2.destroyAllWindows()

    def start(self):
        """Start squat counter with separate processing and display threads."""
        processing_thread = threading.Thread(target=self.process_frames)
        display_thread = threading.Thread(target=self.display_frames)
        
        processing_thread.start()
        display_thread.start()
        
        return processing_thread, display_thread

    def stop(self):
        """Stop all threads."""
        self.stop_event.set()