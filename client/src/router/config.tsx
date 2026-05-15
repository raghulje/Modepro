import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import About from "../pages/about/page";
import Products from "../pages/products/page";
import Rnd from "../pages/rnd/page";
import Manufacturing from "../pages/manufacturing/page";
import Quality from "../pages/quality/page";
import Ehs from "../pages/ehs/page";
import Capabilities from "../pages/capabilities/page";
import Careers from "../pages/careers/page";
import Gallery from "../pages/gallery/page";
import Contact from "../pages/contact/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/rnd",
    element: <Rnd />,
  },
  {
    path: "/manufacturing",
    element: <Manufacturing />,
  },
  {
    path: "/quality",
    element: <Quality />,
  },
  {
    path: "/ehs",
    element: <Ehs />,
  },
  {
    path: "/capabilities",
    element: <Capabilities />,
  },
  {
    path: "/careers",
    element: <Careers />,
  },
  {
    path: "/gallery",
    element: <Gallery />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;