import React, { createContext, useState, useEffect, useRef } from "react";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  logout: () => {},
  isLoading: false,
});

export const AuthProvider = ({ children }) => {
  // helper: decode JWT payload (safe for base64url)
  const parseJwt = (token) => {
    try {
      const payload = token.split(".")[1];
      if (!payload) return null;
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  const isTokenExpired = (token) => {
    const payload = parseJwt(token);
    if (!payload || !payload.exp) return true;
    // exp is in seconds
    return Date.now() >= payload.exp * 1000;
  };

  // Initialize user synchronously from localStorage token so a page reload
  // doesn't cause intermediate "logged out" redirects in other components.
  const initialToken = (() => {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  })();

  const [user, setUser] = useState(() => {
    if (!initialToken) return null;
    if (isTokenExpired(initialToken)) {
      try {
        localStorage.removeItem("token");
      } catch {}
      return null;
    }
    const payload = parseJwt(initialToken);
    if (!payload) return null;
    return {
      id: payload.id || payload.sub || payload.userId || null,
      name: payload.name || null,
      email: payload.email || null,
      _payload: payload,
    };
  });

  const [isLoading, setIsLoading] = useState(true);
  const tokenRef = useRef(initialToken);

  // central logout: clears token, clears state, broadcasts to other tabs, and redirects
  const logout = ({ redirect = true, reload = false } = {}) => {
    try {
      localStorage.removeItem("token");
    } catch {}
    // broadcast a logout event for other tabs
    try {
      localStorage.setItem("logout", Date.now().toString());
    } catch {}
    setUser(null);
    if (redirect) {
      // use window.location to avoid depending on Router/useNavigate
      // redirect to signup page since app uses signup for OAuth-based login
      window.location.assign("/signup");
    }
    if (reload) {
      window.location.reload();
    }
  };

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem("token");
    tokenRef.current = token;

    if (!token) {
      setIsLoading(false);
      return;
    }

    // Check expiry client-side first
    if (isTokenExpired(token)) {
      // token expired -> logout
      logout({ redirect: true });
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!mounted) return;

        if (res.status === 401) {
          // server says token invalid/expired -> logout
          logout({ redirect: true });
          return;
        }

        if (!res.ok) {
          // transient error (server down/CORS) — do NOT force logout.
          // Attempt to set a minimal user from token payload so refresh doesn't log user out.
          const payload = parseJwt(token);
          if (payload && mounted) {
            setUser({
              id: payload.id || payload.sub || payload.userId || null,
              name: payload.name || null,
              email: payload.email || null,
              // include raw payload if needed
              _payload: payload,
            });
          }
          setIsLoading(false);
          return;
        }

        const data = await res.json();
        if (data && data.success) {
          setUser(data.user || null);
        } else {
          // unexpected response — try token payload fallback
          const payload = parseJwt(token);
          if (payload && mounted) {
            setUser({
              id: payload.id || payload.sub || payload.userId || null,
              name: payload.name || null,
              email: payload.email || null,
              _payload: payload,
            });
          } else {
            // fallback: force logout if no info available
            logout({ redirect: true });
          }
        }
      } catch (err) {
        // network error — keep token and set user from token payload if possible
        const payload = parseJwt(token);
        if (payload && mounted) {
          setUser({
            id: payload.id || payload.sub || payload.userId || null,
            name: payload.name || null,
            email: payload.email || null,
            _payload: payload,
          });
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchProfile();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync logout across tabs/windows
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "logout") {
        setUser(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Poll for same-tab direct token removals (covers cases where some UI calls localStorage.removeItem directly)
  useEffect(() => {
    const interval = setInterval(() => {
      const current = localStorage.getItem("token");
      if (tokenRef.current && !current) {
        // token was removed in this tab (direct removal), clear user state
        setUser(null);
        // also broadcast so other tabs can react
        try {
          localStorage.setItem("logout", Date.now().toString());
        } catch {}
      }
      tokenRef.current = current;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
