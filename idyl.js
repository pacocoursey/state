import { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react'

const useLayout = typeof window === 'undefined' ? useEffect : useLayoutEffect

function create(initial) {
  const state = initial
  const listeners = new Set()

  function subscribe(listener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  function setState(key, value) {
    if (!Object.is(state[key], value)) {
      state[key] = value
    }

    listeners.forEach((listener) => listener(state, key))
  }

  function useStore() {
    const rerender = useState()[1]
    const tracked = useRef({})
    const stateRef = useRef(state)

    const proxy = useMemo(() => {
      stateRef.current = state

      return new Proxy(
        {},
        {
          get(_, property) {
            tracked.current[property] = true
            return stateRef.current[property]
          },
          set(_, property, value) {
            setState(property, value)
            return true
          },
        }
      )
    }, [])

    useLayout(() => {
      const unsub = subscribe((_, key) => {
        if (tracked.current[key]) {
          rerender({})
        }
      })

      return unsub
    }, [])

    return proxy
  }

  return useStore
}

export default create
