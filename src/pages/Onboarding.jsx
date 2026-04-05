import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./onboarding.module.css";

export default function Onboarding() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    github_username: "",
    role: "",
    focus: "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    localStorage.setItem("ic_profile", JSON.stringify(form));
    navigate("/connect");
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <span className={styles.logoLockup}>Infinite Context</span>
        <h1 className={styles.headline}>Let's get to know you</h1>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">Name</label>
            <input
              className={styles.input}
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="github_username">GitHub username <span style={{fontWeight: 400, color: "#7a9e7e"}}>(optional)</span></label>
            <input
              className={styles.input}
              id="github_username"
              name="github_username"
              type="text"
              placeholder="github username"
              value={form.github_username}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="role">Role <span style={{fontWeight: 400, color: "#7a9e7e"}}>(optional)</span></label>
            <select
              className={styles.select}
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value=""></option>
              <option>Software engineering student</option>
              <option>Working developer</option>
              <option>Career changer</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="focus">Current focus <span style={{fontWeight: 400, color: "#7a9e7e"}}>(optional)</span></label>
            <input
              className={styles.input}
              id="focus"
              name="focus"
              type="text"
              placeholder="e.g. RAG, system design, interview prep"
              value={form.focus}
              onChange={handleChange}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.submitBtn} type="submit">
            Get Started <span className={styles.arrow}>→</span>
          </button>
        </form>
      </div>
    </div>
  );
}
