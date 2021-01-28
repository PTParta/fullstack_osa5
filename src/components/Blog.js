import React, { useState } from 'react'
const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [showAll, setShowAll] = useState(false)

  const hideWhenVisible = { display: showAll ? 'none' : '' }
  const showWhenVisible = { display: showAll ? '' : 'none' }

  const handleClick = (event) => {
    setShowAll(!showAll)
  }

  return (
    < div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author} <button onClick={handleClick}> view</button >
      </div>
      <div style={showWhenVisible}>
        {blog.title} {blog.author}<button onClick={handleClick}> hide</button >
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button>like</button> </div>
        <div> {blog.user.name}</div>
      </div>
    </div >
  )
}

export default Blog
