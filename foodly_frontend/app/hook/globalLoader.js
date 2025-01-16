import { useState, useEffect } from "react";

const globalLoader = () => {
  const [isLoading, setIsLoading] = useState(false);

  return { isLoading };
};

export default globalLoader;
