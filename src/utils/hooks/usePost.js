import { useEffect, useState } from "react"

function usePost() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/posts")
        .then(res => res.json())
        .then(res => setPosts(res))
    }, [])

    return {
        posts: posts
    }
}
export default usePost