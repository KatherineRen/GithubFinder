import { createContext, useReducer } from 'react'
import githubReduer from './GithubReducer'

const GithubContext = createContext()

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN

export const GithubProvider = ({ children }) => {
  const intialState = {
    users: [],
    loading: false,
  }

  //dispatch an action to reducer
  const [state, dispatch] = useReducer(githubReduer, intialState)

  //get initial users (testing)
  const fetchUsers = async () => {
    setLoading()
    const response = await fetch(`${GITHUB_URL}/users`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    })
    const data = await response.json()

    dispatch({
      type: 'GET_USERS',
      payload: data,
    })
  }

  //get search result
  const searchUsers = async (text) => {
    setLoading()

    const params = new URLSearchParams({
      q: text,
    })
    const response = await fetch(`${GITHUB_URL}/search/users?${params}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    })
    const { items } = await response.json()

    dispatch({
      type: 'GET_USERS',
      payload: items,
    })
  }

  //clear users from state
  const clearUsers = () => {
    dispatch({
      type: 'CLEAR_USERS',
    })
  }

  //set loading
  const setLoading = () => {
    dispatch({
      type: 'SET_LOADING',
    })
  }
  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        fetchUsers,
        searchUsers,
        clearUsers,
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}

export default GithubContext
