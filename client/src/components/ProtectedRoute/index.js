// import React from 'react';
// import { Route, Navigate } from 'react-router-dom';

// function ProtectedRoute({ isAuthenticated, ...props }) {
//   return isAuthenticated ? <Route {...props} /> : <Navigate to="/login" />;
// }

// export default ProtectedRoute;


// import { Route, Navigate } from 'react-router-dom';
// import Cookies from 'js-cookie';

// const ProtectedRoute = ({ component: Component, ...rest }) => {
//   const isAuthenticated = Cookies.get('jwt_token') !== null;
//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         isAuthenticated ? (
//           <Component {...props} />
//         ) : (
//           <Navigate to={{ pathname: '/login' }} />
//         )
//       }
//     />
//   );
// };

// export default ProtectedRoute;

// import React from 'react'
// import { Navigate } from 'react-router-dom'
// function ProtectedRoute({ isSignedIn, children }) {
//   if (!isSignedIn) {
//     return <Navigate to="/" replace />
//   }
//   return children
// }
// export default ProtectedRoute;
