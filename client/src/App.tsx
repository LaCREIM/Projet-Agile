import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import {EnseignantLayout} from "./layouts/EnseignantLayout";

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<EnseignantLayout />}>
      <Route path="*" element={<div>404 Not Found</div>}></Route>
    </Route>,
  ])
);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
