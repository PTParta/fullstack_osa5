import React, { useState } from 'react'
const Blog = ({ blog, likeBlog, user, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [showAll, setShowAll] = useState(false)
  /* 
    console.log('user.username', user.username)
    console.log('blog.user', blog.user)
   */
  const hideWhenVisible = { display: showAll ? 'none' : '' }
  const showWhenVisible = { display: showAll ? '' : 'none' }

  const handleClick = (event) => {
    setShowAll(!showAll)
  }

  const handleLikeClick = (id) => {
    //event.preventDefault()
    likeBlog(id)
  }

  const handleRemoveClick = (id) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlog(id)
    }

  }

  return (
    < div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author} <button onClick={handleClick}> view</button >
      </div>
      <div style={showWhenVisible}>
        {blog.title} {blog.author}<button onClick={handleClick}> hide</button >
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={() => handleLikeClick(blog.id)}>like</button> </div>
        <div> {blog.user.name}</div>
        {user.username === blog.user.username ?
          <div><button onClick={() => handleRemoveClick(blog.id)}>remove</button></div> :
          <div></div>}
      </div>
    </div >
  )
}

export default Blog
