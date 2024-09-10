"use client"
import React from 'react'
import { useEffect, useState } from 'react'
import Header from '@/components/ui/Header'

type Comment = {
    content: string;
    creator: "GUEST"; //ändra till string
}

type Data = {
    id: string;
    category: string;
    title: string;
    description: string;
    creationDate: string;
    comments: Comment[]; //lägg in user någonstans här
    creator: User;
  };

function Thread() {
    const [data, setData] = useState<Data>({
      id: "",
      category: "",
      title: "",
      description: "",
      creationDate: "",
      comments: [], //här med
      creator: { userName: "", userId: "", password: "" },
    });
  
    const [threadId, setThreadId] = useState<string>("");
  
    const [newComment, setNewComment] = useState<string>("");
  
    const key = "forum/threads"; // Adjust this key as needed
  
    useEffect(() => {
      const getIdFromUrl = () => {
        const urlParts = window.location.pathname.split("/");
        return urlParts[urlParts.length - 1];
      };
  
      const id = getIdFromUrl();
      setThreadId(id);
  
      const localData = localStorage.getItem(key);
  
      if (localData) {
        try {
          const parsedArray = JSON.parse(localData) as Data[];
          const threadData = parsedArray.find((thread) => thread.id === id);
  
          if (threadData) {
            setData({ ...threadData, comments: threadData.comments || [] });
          } else {
            console.error("Thread not found.");
          }
        } catch (error) {
          console.error("Failed to parse data from localStorage", error);
        }
      }
    }, [])

    //useEffect ends here
  
    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewComment(e.target.value);
    };
  
    const handleCommentSubmit = (e: React.FormEvent) => {
      e.preventDefault();
  
      if (newComment.trim() === "") return;
  
      const updatedComments: Comment[] = [
        ...data.comments,
        { content: newComment, creator: "GUEST" }, //ändra GUEST
      ];
  
      const updatedData = {
        ...data,
        comments: updatedComments,
      };
  
      const localData = localStorage.getItem(key);
  
      if (localData) {
        try {
          const parsedArray = JSON.parse(localData) as Data[];
          const threadIndex = parsedArray.findIndex(
            (thread) => thread.id === threadId
          );
  
          if (threadIndex !== -1) {
            parsedArray[threadIndex] = updatedData;
            localStorage.setItem(key, JSON.stringify(parsedArray));
          } else {
            console.error("Thread not found during update.");
          }
        } catch (error) {
          console.error("Failed to update data in localStorage", error); //ändra error meddelande från console.log om ni vill
        }
      }
  
      setData(updatedData);
      setNewComment("");
    };
  
  return (                                          //Kolla över och lägg in ytterligare information så som creator
    <>
    <Header/>
    <div className='d-thread'>                      
        <div className="d-thread-container">
            <div className="d-thread-container-top">
              <div className="d-thread-container-top-width">
                <span className='d-thread-poster'>{data.creator.userName}</span>
                <span className='d-thread-category'>{data.category}</span>
              </div>
                <h2 className='d-thread-title'>{data.title}</h2>
            </div>
            <div className="d-thread-container-center">
                <p className='d-thread-text'>
                    {data.description}
                </p>
            </div>
            <div className="d-thread-container-create-comment">
                <form onSubmit={handleCommentSubmit} className='d-thread-container-create-comment'>
                    <div className="d-thread-container-create-comment-input">
                        <label htmlFor="commentField" className='d-thread-label'>Write a comment</label>
                        <input type="text" value={newComment} onChange={handleCommentChange} id='commentField' />
                    </div>
                    <div className="d-thread-container-create-comment-btn">
                        <button type='submit' id='postCommentBtn'>Post</button>
                    </div>
                </form>
            </div>
            <div className="d-thread-container-bottom">
                <h3 id='commentLabel'>Comments</h3>
                {data.comments.map((comment, index) => (
                        <div key={index} className="d-thread-container-bottom-comment">
                            <span className='comment-name'>{comment.creator}</span>
                            <p className='comment-text'>{comment.content}</p>    
                        </div>
                    ))}
            </div>
        </div>
    </div>
    </>
  )
}

export default Thread