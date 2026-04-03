import { useEffect, useRef, useState } from "react";

export default function TagDropdown({ value, onChange, tags }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function select(tag) {
    onChange(tag);
    setOpen(false);
  }

  return (
    <div className="tag-dropdown" ref={ref}>
      <button
        type="button"
        className={`tag-dropdown-btn ${value ? "active" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        {value || "All Tags"}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: "0.4rem" }}>
          <polyline points={open ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
        </svg>
      </button>

      {open && (
        <div className="tag-dropdown-menu">
          <button
            type="button"
            className={`tag-dropdown-item ${value === "" ? "selected" : ""}`}
            onClick={() => select("")}
          >
            All Tags
          </button>
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              className={`tag-dropdown-item ${value === t ? "selected" : ""}`}
              onClick={() => select(t)}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
