import { useState, useEffect } from 'react';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { BiPin,BiDotsVerticalRounded  } from 'react-icons/bi';

interface PostActionsProps {
    post: any;
    isAuthor:boolean;
    userId: string;
    initialLikesCount: number;
    initialCommentsCount: number;
}

function PostActions({ userId, post, initialLikesCount, initialCommentsCount,isAuthor }: PostActionsProps) {
    console.log(userId, post, initialLikesCount, initialCommentsCount,isAuthor);
    
    const [liked, setLiked] = useState(false);
    const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
    const [showComment, setShowComment] = useState(false);
    const [showReportOptions, setShowReportOptions] = useState(false);
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
    const [commentText, setCommentText] = useState('');
    const [isLiking, setIsLiking] = useState(false);
    const [comments, setComments] = useState(post.comments || []);
    const [currentPost, setCurrentPost] = useState(post);
    const [reportReason, setReportReason] = useState('');
    const [expandedComments, setExpandedComments] = useState<string[]>([]);
   

    useEffect(() => {
        if (currentPost.liked.includes(userId)) {
            setLiked(true);
        }
    }, [currentPost, userId]);
    const toggleReplies = (commentId: string) => {
        setExpandedComments(prev =>
            prev.includes(commentId)
                ? prev.filter(id => id !== commentId)
                : [...prev, commentId]
        );
    };
    const handleLike = async () => {
        if (isLiking) return;
        setIsLiking(true);

        try {
            const response = await axiosInstance.post('/api/auth/liked', { userId, postId: currentPost._id });
            if (response.data.status) {
                setLiked(!liked);
                setLikesCount(prevCount => !liked ? prevCount + 1 : prevCount - 1);
            }
        } catch (error) {
            console.error('Error liking post:', error);
        } finally {
            setIsLiking(false);
        }
    };

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [shareableLink, setShareableLink] = useState('');

    const handleShare = () => {
        const link = `${window.location.origin}/post/${post._id}`;
        setShareableLink(link);
        setIsShareModalOpen(true);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareableLink).then(() => {
           
        }).catch((error) => {
            console.error('Error copying link:', error);
        });
    };

    const closeModal = () => {
        setIsShareModalOpen(false);
    };

    const handleComment = () => {
        setShowComment(true);
    };

    const handleCommentSubmit = async () => {
        try {
            const response = await axiosInstance.post('/api/auth/comment', { userId, postId: currentPost._id, text: commentText });
            console.log(response);
            
            if (response.data.status) {
                setCommentsCount(prevCount => prevCount + 1);
                
                setComments((prevComments:any) => [...prevComments, response.data.data]);
                setCommentText('');
                setCurrentPost(response.data.data);
                console.log('currentPost',currentPost);
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const handleCloseModal = () => {
        setShowComment(false);
    };
    const handlereport = async (type: string) => {
        try {
          
          if (!userId || !currentPost?._id || !reportReason) {
            throw new Error('Missing required information to submit the report');
          }
      
          const response = await axiosInstance.post('/api/auth/report', {
            reportedPostId: currentPost._id,
            reason: reportReason,
            type,
          });
      
          if (response.data.status) {
            toast.success('Report submitted successfully');
          } else {
            toast.error('Failed to submit report');
          }
        } catch (error) {
          console.error('Error submitting report:', error);
          toast.error('An error occurred while submitting the report');
        }
      };
      const [replyText, setReplyText] = useState('');
      
    
      const handleReply = async (commentId: any) => {
        if (!replyText.trim()) return;
        try {
          const response = await axiosInstance.post(`/api/auth/reply`, {
            text: replyText,
            userId: userId,
            postId: post._id,
            commentId: commentId
          });
      
          if (response.data.status) {
           
            setComments((prevComments:any) => prevComments.map((comment:any) => 
            comment._id === commentId 
              ? { ...comment, replies: [...(comment.replies || []), response.data.data] }
              : comment
          ));
              
      
            setActiveCommentId(null);
            setReplyText('');
          } else {
            toast.error(response.data.message || 'Failed to add reply');
          }
        } catch (error) {
          console.error('Error adding reply:', error);
          toast.error('An error occurred while adding the reply');
        }
      };
      const handlePinComment = async (commentId: string) => {
        try {
            const response = await axiosInstance.patch(`/api/auth/pinComment`, {
                postId: post._id,
                commentId: commentId,
                userId: userId,
            });
    
            if (response.data.status) {
                setComments((prevComments: any) => {
                    const updatedComments = prevComments.map((comment: any) => 
                        comment._id === commentId
                            ? { ...comment, isPinned: !comment.isPinned }
                            : { ...comment, isPinned: false } 
                    );
    
                    return updatedComments.sort((a: any, b: any) => {
                        if (a.isPinned === b.isPinned) return 0;
                        return a.isPinned ? -1 : 1; 
                    });
                });
            } else {
                toast.error('Failed to update comment pin status.');
            }
        } catch (error) {
            console.error('Error pinning comment:', error);
            toast.error('An error occurred while pinning the comment.');
        }
    };
    
    

    const toggleOptionsMenu = (commentId: string) => {
        setActiveCommentId(prev => (prev === commentId ? null : commentId));
    };
    
    return (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
                <button
                    className={`flex items-center space-x-1 px-3 py-2 rounded-full transition-colors duration-200 ${
                        liked ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-blue-100'
                    }`}
                    onClick={handleLike}
                    disabled={isLiking}
                >
                    <span className="text-xl">👍</span>
                    <span>{likesCount}</span>
                </button>
                <button
                    className="flex items-center space-x-1 px-3 py-2 bg-white text-gray-700 rounded-full hover:bg-blue-100 transition-colors duration-200"
                    onClick={handleComment}
                >
                    <span className="text-xl">💬</span>
                    <span>{commentsCount}</span>
                </button>
                <button
                    className='flex items-center space-x-1 px-3 py-2 rounded-full transition-colors duration-200'
                    onClick={handleShare}>
                
                    <span className="text-xl">🔗</span>
                    <span>Share</span>

                </button>
                <button
                    className="flex items-center space-x-1 px-3 py-2 bg-white text-gray-700 rounded-full hover:bg-red-100 transition-colors duration-200"
                    onClick={() => setShowReportOptions(!showReportOptions)}
                >
                    <span className="text-xl">⚠️</span>
                    <span>Report</span>
                </button>
            </div>
            <button
                onClick={handleCloseModal}
                className="absolute top-2 left-2 text-gray-500 hover:text-gray-700"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <Modal
                isOpen={showComment}
                onRequestClose={handleCloseModal}
                contentLabel="Comments Modal"
                className="bg-white p-10 rounded-lg shadow-lg max-w-2xl mx-auto mt-10 max-h-[80vh] overflow-y-auto relative"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <button
                    onClick={handleCloseModal}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <h2 className="text-2xl font-bold mb-4">Comments</h2>
                <div className="mb-4">
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Enter your comment..."
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                    />
                    {commentText.trim() && (
                        <button
                            onClick={handleCommentSubmit}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                        >
                            Submit
                        </button>
                    )}
                </div>
                
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Existing Comments</h3>
                    {comments.length > 0 ? (
                        comments.map((comment: any) => (
                            <div key={comment._id} className={`bg-gray-50 p-3 rounded-lg mb-2 ${comment.isPinned ? 'border-l-4 border-blue-500' : ''}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-700">
                        <strong>{comment.userId?.name || 'Unknown User'}</strong>: {comment.text}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(comment.createdAt).toLocaleString()}</p>
                </div>
                {isAuthor && (
                  <>
                  <button
                        className="text-gray-500 hover:text-blue-700"
                        onClick={() => toggleOptionsMenu(comment._id)}
                    >
                        <BiDotsVerticalRounded size={20} />
                    </button>
                        {comment.isPinned&&
                        <><BiPin size={20} className={comment.isPinned ? 'text-blue-500' : 'text-gray-500'} />
                        <span className="ml-1">{comment.isPinned ? '' : 'Pinned'}</span></>}
                    
                    {activeCommentId === comment._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                            <button
                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                    handlePinComment(comment._id);
                                    setActiveCommentId(null); 
                                }}
                            >
                                {comment.isPinned ? 'Unpin Comment' : 'Pin Comment'}
                            </button>
                          
                        </div>
                    )}
                  </>
                   
                
                )}
            </div>
            {comment.replies && comment.replies.length > 0 && (
                <>
                    <button
                        className="text-blue-500 text-sm mt-2 hover:underline"
                        onClick={() => toggleReplies(comment._id)}
                    >
                        {expandedComments.includes(comment._id) ? 'Hide Replies' : `Show Replies (${comment.replies.length})`}
                    </button>
                    {expandedComments.includes(comment._id) && (
                        <div className="ml-4 mt-2 space-y-2">
                            {comment.replies.map((reply: any, index: number) => (
                                <div key={index} className="bg-white p-2 rounded-md">
                                    <p className="text-sm text-gray-600">
                                        <strong>{reply.userId?.name || 'Unknown User'}</strong>: {reply.text}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(reply.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            
            {activeCommentId === comment._id ? (
                <div className="mt-2">
                    <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {replyText.trim() && (
                        <button
                            className="mt-1 px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors duration-200"
                            onClick={() => handleReply(comment._id)}
                        >
                            Submit Reply
                        </button>
                    )}
                </div>
            ) : (
                <button
                    className="mt-2 text-blue-500 text-sm hover:underline"
                    onClick={() => setActiveCommentId(comment._id)}
                >
                    Reply
                </button>
            )}
        </div>)
                    )) : (
                        <p className="text-gray-500 italic">No comments yet.</p>
                    )}
                </div>
            </Modal>
            <Modal
                isOpen={isShareModalOpen}
                onRequestClose={closeModal}
                contentLabel="Share Post"
                className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-lg font-bold mb-4">Share this Post</h2>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        readOnly
                        value={shareableLink}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleCopyLink}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                    >
                        Copy
                    </button>
                </div>
                <button
                    onClick={closeModal}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                >
                    Close
                </button>
            </Modal>
            
            {showReportOptions && (
        <div className="report-options bg-white shadow-md rounded-lg p-4 mt-2">
          <select
            className="w-full p-2 rounded border border-gray-300"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          >
            <option value="" disabled>Select a reason</option>
            <option value="Spam">Spam</option>
            <option value="Harassment">Harassment</option>
            <option value="Inappropriate Content">Inappropriate Content</option>
          </select>
          <button
            className={`mt-3 bg-red-500 text-white p-2 rounded ${
              !reportReason ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => handlereport('post')}
            disabled={!reportReason}
          >
            Submit
          </button>
        </div>
      )}
      
    </div>
  );
}

export default PostActions;
