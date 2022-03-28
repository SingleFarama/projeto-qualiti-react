import { BrowserRouter, Switch, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Allocation from "./pages/Allocation";
import Department from "./pages/Department";
import Professor from "./pages/Professor";

const routes = [
  {
    path: "/home",
    name: "Home",
    visible: false,
    component: Home,
  },
  {
    path: "/allocations",
    name: "Alocações",
    component: Allocation,
  },
  {
    path: "/departament",
    name: "Departamentos",
    component: Department,
  },
  {
    path: "/courses",
    name: "Cursos",
    component: Courses,
  },
  {
    path: "/professor",
    name: "Professores",
    component: Professor,
  },
];

const Router = () => (
  <BrowserRouter>
    <Layout routes={routes}>
      <Switch>
        {routes.map((route, index) => (
          <Route
            component={route.component}
            exact
            key={`-B-${index}`}
            path={route.path}
          />
        ))}
      </Switch>
    </Layout>
  </BrowserRouter>
);

export default Router;
