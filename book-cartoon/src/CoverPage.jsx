// CoverPage.jsx
import React from 'react';

const CoverPage = React.forwardRef(({ children, className = '' }, ref) => (
  <div
    ref={ref}
    className={`w-full h-full flex items-center justify-center ${className}`}
  >
    {children}
  </div>
));

export default CoverPage;
