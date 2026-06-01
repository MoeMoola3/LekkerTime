// import React from 'react';
// import { RouterProvider } from 'react-router';
// import { router } from './routes';
// import '../styles/fonts.css';

// export default function App() {
//   return <RouterProvider router={router} />;
// }

import React from "react";
import { RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { router } from "./routes";
import "../styles/fonts.css";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
