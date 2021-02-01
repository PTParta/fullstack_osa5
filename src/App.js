import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    console.log('handling logout')
    window.localStorage.clear()
    setUser(null)
  }

  const addBlog = (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      blogService
        .create(blogObject)
        .then(returnedBlog => {
          returnedBlog.user = user
          setBlogs(blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes))
        })
      setNotificationMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('an error occurred')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const likeBlog = (id) => {
    const blog = blogs.find(b => b.id === id)
    //console.log('blog before like')
    //console.log(blog)
    const likedBlog = { ...blog, likes: blog.likes + 1 }
    //console.log('blog after like')
    //console.log(likedBlog)

    blogService
      .update(id, likedBlog)
      .then(returnedBlog => {
        //console.log('returned blog')
        //console.log(returnedBlog)
        returnedBlog.user = likedBlog.user
        //console.log(returnedBlog)
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog).sort((a, b) => b.likes - a.likes))
      })
      .catch(() => {
        setErrorMessage(
          `Blog '${blog.title}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const removeBlog = (id) => {
    console.log('removing blog with an id of: ', id)

    const blogToBeRemoved = blogs.filter(blog => blog.id === id)
    console.log('blogToBeRemoved', blogToBeRemoved)
    try {
      blogService
        .remove(id)
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id !== id))
        })
      setNotificationMessage(`blog ${blogToBeRemoved[0].title} by ${blogToBeRemoved[0].author} removed`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('an error occurred')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

  }

  const loginForm = () => (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const blogsListed = () => (
    <div>
      <h2>blogs</h2>
      <table>
        <tbody>
          <tr>
            <td>{user.name} logged in </td>
            <td><button onClick={handleLogout}>logout</button></td>
          </tr>
        </tbody>
      </table>

      <Togglable buttonLabel='new note' ref={blogFormRef}>
        <BlogForm user={user} createBlog={addBlog} setErrorMessage={setErrorMessage} removeBlog={removeBlog}
        />
      </Togglable>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeBlog={likeBlog} user={user} removeBlog={removeBlog} />
      )}
    </div>
  )

  return (
    <div>
      <Notification message={errorMessage} />
      <Notification message={notificationMessage} />

      {user === null ?
        loginForm() :
        <div>
          {(blogsListed())}
        </div>}
    </div>
  )
}

export default App