"use client"
import React from 'react'
import { useEffect, useState } from 'react'
import Header from '@/components/ui/Header'
import decipherUser from '@/lib/decipherUser'
import findUser from '@/lib/findUser'

type Comment = {
    id: string;
    content: string;
    creator: User; //ändra till string
    isAnswer?: boolean;
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

    const token = sessionStorage.getItem('forum/token')
  
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

      if(!token) return

      const username = decipherUser(token)

      const activeUser = findUser(username)

      if(!activeUser) return
  
      if (newComment.trim() === "") return;
  
      const updatedComments: Comment[] = [
        ...data.comments,
        {id:crypto.randomUUID() , content: newComment, creator: activeUser, isAnswer: false },
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

    const handleAnswerToggle = (id: string) => {
      const updatedComments = data.comments.map(comment => 
        comment.id === id ? { ...comment, isAnswer: !comment.isAnswer } : comment
      );

      const updatedData = { ...data, comments: updatedComments };

      // Update localStorage
      const localData = localStorage.getItem(key);

      if (localData) {
        try {
          const parsedArray = JSON.parse(localData) as Data[];
          const threadIndex = parsedArray.findIndex((thread) => thread.id === threadId);

          if (threadIndex !== -1) {
            parsedArray[threadIndex] = updatedData;
            localStorage.setItem(key, JSON.stringify(parsedArray));
          }
        } catch (error) {
          console.error("Failed to update data in localStorage", error);
        }
      }

      setData(updatedData);
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

              {token? (
                <form onSubmit={handleCommentSubmit} className='d-thread-container-create-comment'>
                    <div className="d-thread-container-create-comment-input">
                        <label htmlFor="commentField" className='d-thread-label'>Write a comment</label>
                        <input type="text" value={newComment} onChange={handleCommentChange} id='commentField' />
                    </div>
                    <div className="d-thread-container-create-comment-btn">
                        <button type='submit' id='postCommentBtn'>Post</button>
                    </div>
                </form>
              ) : (
                <p id='dThreadCommentPrompt'>Sign in to comment</p>
              )}

                
            </div>
            <div className="d-thread-container-bottom">
                <h3 id='commentLabel'>Comments</h3>
                {data.comments.map((comment, index) => (
                        <div key={index} className={`d-thread-container-bottom-comment${comment.isAnswer ? '-answer' : ''}`}>
                          <div className="d-thread-container-bottom-comment-left">
                            <span className='comment-name'>{comment.creator.userName}</span>
                            <p className='comment-text'>{comment.content}</p>    
                          </div>
                          <div className="d-thread-container-bottom-comment-right">
                            {token && data.category === 'QNA' && (
                            <span
                              id='commentAnswerText'
                              className={comment.isAnswer ? "marked-as-answer" : ""}
                              onClick={() => handleAnswerToggle(comment.id)}>
                              {comment.isAnswer ? "Unmark answer" : "Mark answer"}
                            </span>
                            )}
                          </div>
                        </div>
                    ))}
            </div>
        </div>
    </div>
    </>
  )
}

export default Thread