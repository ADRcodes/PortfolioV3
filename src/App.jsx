import { Route, Routes } from "react-router";
import AppShell from "./components/layout/AppShell.jsx";
import About from "./pages/About.jsx";
import AIConsulting from "./pages/AIConsulting.jsx";
import Contact from "./pages/Contact.jsx";
import Home from "./pages/Home.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Playground from "./pages/Playground.jsx";
import Projects from "./pages/Projects.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:projectId" element={<ProjectDetail />} />
        <Route path="ai-consulting" element={<AIConsulting />} />
        <Route path="playground" element={<Playground />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}
