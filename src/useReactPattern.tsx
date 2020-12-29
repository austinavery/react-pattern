import React, { useState, useRef, useEffect } from 'react'

interface ReactPatternComponents {
  Unloaded: React.FC
  Loading: React.FC
  Loaded: React.FC
  Error: React.FC
}

type ReactPatternResponse<AsyncResponse> =
  | {
      status: 'Unloaded'
    }
  | {
      status: 'Loading'
    }
  | {
      status: 'Loaded'
      data: AsyncResponse
    }
  | {
      status: 'Error'
      message: string
    }

interface ReactPatternOutput<AsyncResponse> {
  ReactPattern: ReactPatternComponents
  patternResponse: ReactPatternResponse<AsyncResponse>
}

export function useReactPattern<AsyncResponse>(
  input: Parameters<typeof fetch>,
): ReactPatternOutput<AsyncResponse> {
  const [patternResponse, setPatternResponse] = useState<
    ReactPatternResponse<AsyncResponse>
  >({ status: 'Unloaded' })

  const isUnmounted = useRef(false)

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setPatternResponse({ status: 'Loading' })

        const data = await fetch(...input)

        if (isUnmounted.current) {
          return
        }

        if (data.ok) {
          const asyncResponse = (await data.json()) as AsyncResponse
          setPatternResponse({ status: 'Loaded', data: asyncResponse })
        }
      } catch (e) {
        if (!isUnmounted.current) {
          setPatternResponse({ status: 'Error', message: e.message })
        }
      }
    }
  })

  const Unloaded: React.FC = ({ children }) => {
    if (patternResponse.status !== 'Unloaded') {
      return null
    }

    return <>{children}</>
  }

  const Loading: React.FC = ({ children }) => {
    if (patternResponse.status !== 'Loading') {
      return null
    }

    return <>{children}</>
  }

  const Loaded: React.FC = ({ children }) => {
    if (patternResponse.status !== 'Loaded') {
      return null
    }

    return <>{children}</>
  }

  const Error: React.FC = ({ children }) => {
    if (patternResponse.status !== 'Error') {
      return null
    }

    return <>{children}</>
  }

  return {
    ReactPattern: {
      Unloaded,
      Loading,
      Loaded,
      Error,
    },
    patternResponse,
  }
}
