import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Categories from "./routes/categories/Categories";
import Product from "./routes/products/Products";
import Login from "./routes/login/Login";
import Home from "./routes/home/Home";
import Users from "./routes/users/Users";
import CreateUser from "./routes/users/CreateUser";
import EditUser from "./routes/users/EditUser";
import CreateCat from "./routes/categories/CreateCat";
import EditCat from "./routes/categories/EditCat";
import CreateProduct from "./routes/products/CreateProduct";
import EditProduct from "./routes/products/EditProduct";
import ProtectedRoute from "./components/protectedRoute/protectedRoute";
export default function Routers() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="products">
          <Route
            index
            element={
              <ProtectedRoute>
                <Product />
              </ProtectedRoute>
            }
          />
          <Route
            path="create"
            element={
              <ProtectedRoute>
                <CreateProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit/:id"
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="categories">
          <Route
            index
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="create"
            element={
              <ProtectedRoute>
                <CreateCat />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit/:id"
            element={
              <ProtectedRoute>
                <EditCat />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="users">
          <Route
            index
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="create"
            element={
              <ProtectedRoute>
                <CreateUser />
              </ProtectedRoute>
            }
          />
          <Route
            path=":id/edit"
            element={
              <protectedRoute>
                <EditUser />
              </protectedRoute>
            }
          />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
