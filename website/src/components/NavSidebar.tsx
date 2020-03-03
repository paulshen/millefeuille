import { Link } from "gatsby"
import * as React from "react"
import styles from "./NavSidebar.module.css"

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} activeClassName={styles.navListActiveLink}>
        {children}
      </Link>
    </li>
  )
}

export default function NavSidebar() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/layer">Layer</NavLink>
        <NavLink to="/dialog">Dialog</NavLink>
        <NavLink to="/popperlayer">PopperLayer</NavLink>
        <NavLink to="/tooltip">Tooltip</NavLink>
      </ul>
    </nav>
  )
}
