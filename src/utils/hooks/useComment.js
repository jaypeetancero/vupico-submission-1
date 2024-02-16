import { useEffect, useState } from "react"

function useComment(postId) {
    const [comments, setComments] = useState([])

    useEffect(() => {
        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
        .then(res => res.json())
        .then(res => setComments(res))
    }, [postId])

    return {
        comments: comments
    }
}
export default useComment