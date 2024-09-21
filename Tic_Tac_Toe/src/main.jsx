import { createRoot } from "react-dom/client";
import "./style/global.css";

import Tic_Tac_Toe from "./Pages/Tic_Tac_Toe";
import MineField from "./Pages/MineField";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Comp/Root/index.jsx";
import ErrorPage from "./Pages/ErrorPage/index.jsx";
import HomePage from "./Pages/Home/index.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "Tic_Tac_Toe",
        element: <Tic_Tac_Toe />,
      },
      {
        path: "MineField",
        element: <MineField />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);