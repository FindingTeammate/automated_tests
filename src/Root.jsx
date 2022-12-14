import { useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "./AuthProvider";
import styles from "./root.module.scss";

export default function Root() {
  let location = useLocation();
  const navigate = useNavigate();

  const [authDetails] = useAuthContext();
  const { id = 1 } = authDetails || {};

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/login");
    }
  }, []);

  return (
    <main className={styles.rootContainer}>
      <nav>
        {location.pathname.startsWith("/user") ? (
          <div className={styles.appContainer}>
            <NavLink to="/user-list" className={styles["home"]}>
              FTM
            </NavLink>
            <div>
              <NavLink to={`/user-detail/${id}`} className={styles["me"]}>
                Me
              </NavLink>
              <NavLink
                to="/user-accepted-requests"
                className={styles["logout"]}
              >
                Friends
              </NavLink>
              <NavLink to="/login" className={styles["logout"]}>
                Logout
              </NavLink>
            </div>
          </div>
        ) : (
          <div className={styles.authContainer}>
            <NavLink to="/login" className={styles["logout"]}>
              Login
            </NavLink>
            <NavLink to="/register" className={styles["logout"]}>
              Register
            </NavLink>
          </div>
        )}
      </nav>
      <Outlet />
    </main>
  );
}
