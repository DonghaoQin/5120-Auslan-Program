import { NavLink, Link } from "react-router-dom";

const linkStyle = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

export default function NavBar() {
  return (
    <nav className="nav">
      
      <Link to="/" className="brand">Auslan Learning Hub</Link>

      
      <div className="links">
        <NavLink to="/" end className={linkStyle}>Home</NavLink>
        <NavLink to="/insights" className={linkStyle}>Insights</NavLink>
        <NavLink to="/learn/letters-numbers" className={linkStyle}>
          Letters & Numbers
        </NavLink>
        {/* Basic Words 未完成，暂时隐藏
        <NavLink to="/learn/words" className={linkStyle}>Basic Words</NavLink>
        */}
        <NavLink to="/quiz" className={linkStyle}>Mini Quiz</NavLink>
      </div>
    </nav>
  );
}
