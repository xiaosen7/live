// import {
//   createBrowserRouter,
//   RouterProvider,
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Outlet,
//   NavLink,
//   useNavigate,
//   useParams,
//   Navigate,
//   useLocation,
//   // useLoaderData,
// } from "react-router-dom";

import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter as Router,
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useLocation,
  Outlet,
  useNavigate,
  useParams,
  Navigate,
  // useLoaderData,
} from "./react-router-nut";

export {
  createBrowserRouter, // App2
  RouterProvider, // App2
  Router, // App
  // BrowserRouter,
  Routes, // App
  Route, // App
  NavLink, // Home | About | CustomLink
  useLocation, // useRoutes |  Login | | AuthProvider/RequireAuth
  Outlet, // layouts/Layout
  useNavigate, // Login | ProductDetail(`navigate(-1)`) | Link | Navigate
  useParams, // ProductDetail(`navigate(-1)`)
  Navigate, // Login | AuthProvider/RequireAuth
  // useLoaderData, // DataLoading
};
