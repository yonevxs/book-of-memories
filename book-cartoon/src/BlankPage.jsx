import React from 'react';

const BlankPage = React.forwardRef((props, ref) => (
  <div
    ref={ref}
    className="w-full h-full bg-transparent pointer-events-none"
  />
));

export default BlankPage;
