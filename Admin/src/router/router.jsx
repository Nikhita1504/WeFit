import { createBrowserRouter } from "react-router-dom";
import App from "../App";
// import GoogleAuth from "../pages/GoogleAuth";
// import Home from "../pages/Home";
import ChallengeList from "../components/ChallengeList";
import ChallengeForm from "../components/ChallengeForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/challenges",
        element: <ChallengeList />
      },
      {
        path: "/challenges/new",
        element: <ChallengeForm />
      },
      {
        path: "/challenges/edit/:id",
        element: <ChallengeForm />
      }
    ]
  }
]);

export default router;

