import { Link, NavLink, useLocation } from "react-router-dom";
import "./NavBar.css"; // 引入自定义样式

export default function NavBar() {
  const location = useLocation();

  // 判断是否是首页
  const isHomePage = location.pathname === "/home" || location.pathname === "/";

  return (
    <>
      {/* 只有非 Home 页面才显示遮挡条 */}
      {!isHomePage && <div className="top-mask"></div>}

      {/* 导航栏 */}
      <nav className="navbar">
        {/* 左侧：项目名 */}
        <Link to="/home" className="brand">
          Hello Auslan!
        </Link>

        {/* 右侧：按钮 */}
        <div className="nav-links">
          <NavLink to="/home" className="nav-button">
            Home
          </NavLink>
          <NavLink to="/insights" className="nav-button">
            Insights
          </NavLink>
          <NavLink to="/learn/letters-numbers" className="nav-button">
            Letters & Numbers
          </NavLink>
          <NavLink to="/learn/words" className="nav-button">
            Basic Words
          </NavLink>
          <NavLink to="/story-book" className="nav-button"  onClick={(e) => handleNavClick(e, "/story-book", "Story Book")}>
            Story Book
          </NavLink>
          <NavLink to="/quiz" className="nav-button" onClick={(e) => handleNavClick(e, "/quiz", "Quiz Hub")}>
            Quiz Hub
          </NavLink>
        </div>
      </nav>
    </>
  );
}
