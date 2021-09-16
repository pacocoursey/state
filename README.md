# idyl

merge ideas from zustand + swr + valtio into a simple shared state
- zustand: create a store (not tied to component)
- swr: only re-render for the values you rely on (getter)
- valtio: use proxy and broadcast

```jsx
const useStore = create({
  name: 'John',
  username: 'johndoe'
})

function NameDisplay() {
  const state = useStore()
  
  // Only re-renders when state.name changes
  // mutate the value directly rather than setState
  return <input value={state.name} onChange={e => state.name = e.target.value} />
}
```

---

#### setState

similar version of this API in which you lose the setter but gain destructuring:

```jsx
const [{ name }, setState] = useStore()

return <input value={name} onChange={e => setState({ name: e.target.value })} />
```

---

#### context

React Context version without creating a global store:

```jsx
import { Provider, useContext } from 'idyl'

function Form() {
  return (
    <Provider value={{ name: 'John', username: 'johndoe' }}>
      <NameDisplay />
    </Provider>
  )
}

function NameDisplay() {
  const state = useContext()
  
  return <input value={state.name} onChange={e => state.name = e.target.value} />
}
```


wip thoughts
