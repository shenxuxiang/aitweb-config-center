import React, { memo, useEffect, useState } from 'react';

function Foo() {
  const [ count, setCount ] = useState(0);

  useEffect(() => {
    setCount((prev) => prev + 1);
    setCount(prev => prev + 2);
  }, []);

  return (
    <div>hello world: {count}</div>
  );
}

export default memo(Foo);
