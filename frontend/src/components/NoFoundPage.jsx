import React from 'react';

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <p>You may have mistyped the address or the page may have been removed.</p>
      {/* Optional: Add a link back to the homepage */}
      {/* <a href="/">Go back to the homepage</a> */}
    </div>
  );
}

export default NotFound;