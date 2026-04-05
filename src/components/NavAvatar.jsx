import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NavAvatar.module.css";

export default function NavAvatar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const raw = localStorage.getItem("ic_profile");
  const profile = raw ? JSON.parse(raw) : null;

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSignOut() {
    localStorage.removeItem("ic_profile");
    navigate("/onboarding");
  }

  if (!profile) {
    return (
      <button className={styles.avatarBtn} onClick={() => navigate("/onboarding")}>
        👤
      </button>
    );
  }

  const initial = profile.name ? profile.name[0].toUpperCase() : "?";

  return (
    <div className={styles.wrapper} ref={ref}>
      <button className={styles.avatarBtn} onClick={() => setOpen((v) => !v)}>
        {initial}
      </button>
      {open && (
        <div className={styles.dropdown}>
          <div className={styles.profileSection}>
            <span className={styles.name}>{profile.name}</span>
            <span className={styles.username}>@{profile.github_username}</span>
            <span className={styles.role}>{profile.role}</span>
          </div>
          <div className={styles.divider} />
          <button className={styles.signOutBtn} onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
