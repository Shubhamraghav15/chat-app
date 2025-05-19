// import { createContext, useState, useEffect } from 'react';
// // import jwt_decode from 'jwt-decode';

// export const AuthContext = createContext();

// function parseJwt(token) {
//   try {
//     return JSON.parse(atob(token.split('.')[1]));
//   } catch (e) {
//     return null;
//   }
// }

// export function AuthProvider({ children }) {
//   const [authTokens, setAuthTokens] = useState(() => {
//     const tokens = localStorage.getItem('authTokens');
//     return tokens ? JSON.parse(tokens) : null;
//   });

//   const [user, setUser] = useState(() => {
//     const tokens = localStorage.getItem('authTokens');
//     return tokens ? parseJwt(JSON.parse(tokens).access) : null;
//   });


//   useEffect(() => {
//     if (authTokens) {
//       localStorage.setItem('authTokens', JSON.stringify(authTokens));
//       setUser(parseJwt(authTokens.access));
//     } else {
//       localStorage.removeItem('authTokens');
//       setUser(null);
//     }
//       console.log("🚀 ~ useEffect ~ User:", user)
//   }, [authTokens]);

//   const login = (data) => {
//     setAuthTokens(data);
//     setUser(parseJwt(data.access));
//   };

//   const logout = () => {
//     setAuthTokens(null);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ authTokens, user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
import { createContext, useState, useEffect } from 'react';
import axios from '../api/axios'; // Ensure this points to your configured axios instance

export const AuthContext = createContext();

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [authTokens, setAuthTokens] = useState(() => {
    const tokens = localStorage.getItem('authTokens');
    return tokens ? JSON.parse(tokens) : null;
  });

  const [user, setUser] = useState(() => {
    const tokens = localStorage.getItem('authTokens');
    return tokens ? parseJwt(JSON.parse(tokens).access) : null;
  });

  useEffect(() => {
    if (authTokens) {
      localStorage.setItem('authTokens', JSON.stringify(authTokens));
      setUser(parseJwt(authTokens.access));
    } else {
      localStorage.removeItem('authTokens');
      setUser(null);
    }
    console.log("🚀 ~ useEffect ~ User:", user);
  }, [authTokens]);

  const login = (data) => {
    setAuthTokens(data);
    setUser(parseJwt(data.access));
  };

  const logout = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post('auth/token/refresh/', {
        refresh: authTokens?.refresh,
      });

      const newTokens = {
        access: response.data.access,
        refresh: authTokens.refresh,
      };

      setAuthTokens(newTokens);
      setUser(parseJwt(newTokens.access));
      localStorage.setItem('authTokens', JSON.stringify(newTokens));
    } catch (err) {
      console.error('🔴 Failed to refresh token:', err);
      logout();
    }
  };

  // Refresh access token every 4 minutes
  useEffect(() => {
    if (authTokens) {
      const interval = setInterval(() => {
        refreshToken();
      }, 4 * 60 * 1000); // 4 minutes

      return () => clearInterval(interval);
    }
  }, [authTokens]);

  return (
    <AuthContext.Provider value={{ authTokens, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
