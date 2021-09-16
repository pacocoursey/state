import * as React from 'react'

const Context = React.createContext()

export const useContext = () => {
  const rerender = React.useState()[1]
  const tracked = React.useRef({})
  const { state, subscribe } = React.useContext(Context)

  const proxy = React.useRef(
    new Proxy(
      {},
      {
        get(_, key) {
          tracked.current[key] = true
          return state[key]
        },
        set(_, key, value) {
          state[key] = value
          return true
        },
      }
    )
  )

  React.useEffect(() => {
    return subscribe((key) => {
      if (tracked.current[key]) {
        rerender({})
      }
    })
  }, [])

  return proxy.current
}

export const Provider = ({ children, value = {} }) => {
  const state = React.useRef(value)
  const listeners = React.useRef(new Set())
  const proxy = React.useRef(
    new Proxy(
      {},
      {
        get(_, key) {
          return state.current[key]
        },
        set(_, key, value) {
          state.current[key] = value
          listeners.current.forEach((listener) => listener(key, value))
          return true
        },
      }
    )
  )

  const subscribe = (listener) => {
    listeners.current.add(listener)
    return () => listeners.current.delete(listener)
  }

  const context = React.useMemo(() => ({ state: proxy.current, subscribe }), [])
  return <Context.Provider value={context}>{children}</Context.Provider>
}
