import Home from "./pages/Home";
import Projects from "./pages/Projects/Projects";
import Category from "./pages/Category/Category";
import Film from "./pages/Film/Film";
import About from "./pages/About/About";

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const parts = path.split("/").filter(Boolean);

  if (path === "/") return <Home />;
  if (path === "/work" || path === "/projects") return <Projects />;
  if (parts[0] === "work" && parts.length === 2) {
    return <Category slug={parts[1]} />;
  }
  if (parts[0] === "work" && parts.length === 3) {
    return <Film slug={parts[1]} n={parts[2]} />;
  }
  if (path === "/about") return <About />;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        color: "#fff",
      }}
    >
      <a href="/">Back home</a>
    </main>
  );
}