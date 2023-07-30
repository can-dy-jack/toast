import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css'
import Root from "./pages/layout";
import Home from './pages/home.jsx'
import Upload from './pages/upload';
import Repo from './pages/setting/repo';
import Page404 from "./pages/404";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Page404 />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/upload',
        element: <Upload />,
      },
      {
        path: '/setting', 
        children: [
          {
            path: 'repo',
            element: <Repo />,
          }
        ]
      }
    ]
  },
], {
  basename: "/toast"
});

function App() {
  return (
    <RouterProvider router={router}></RouterProvider>
  )
}

export default App
