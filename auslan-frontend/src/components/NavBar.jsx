import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) =>
  "nav-link" + (isActive ? " active" : "");

export default function NavBar() {
  return (
    <nav className="nav">
      <div className="brand">Auslan Learning Hub</div>
      <div className="links">
        <NavLink to="/" className={linkStyle}>Home</NavLink>
        <NavLink to="/insights" className={linkStyle}>Insights</NavLink>
        <NavLink to="/learn/letters-numbers" className={linkStyle}>Letters & Numbers</NavLink>
        <NavLink to="/learn/words" className={linkStyle}>Basic Words</NavLink>
        <NavLink to="/quiz" className={linkStyle}>Mini Quiz</NavLink>
      </div>
    </nav>
  );
}
