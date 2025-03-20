"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import type { ReactNode } from "react"

export default function ClientWrapper({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: false,
          },
        },
      }),
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

