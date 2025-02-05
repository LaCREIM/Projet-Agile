import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import EnseignantsHome from "./components/Enseignant/EnseignantsHome";
import PromotionHome from "./components/Promotion/PromotionHome";

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<AdminLayout />}>
      <Route path="enseignants" element={<EnseignantsHome/>}/>
      <Route path="promotions" element={<PromotionHome/>}/>
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
