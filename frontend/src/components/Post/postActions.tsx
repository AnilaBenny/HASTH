import { useState, useEffect } from 'react';
import axiosInstance from '../../Axiosconfig/Axiosconfig';
import Modal from 'react-modal';

interface PostActionsProps {
    post: any;
    userId: string;
    initialLikesCount: number;
    initialCommentsCount: number;
}

function PostActions({ userId, post, initialLikesCount, initialCommentsCount }: PostActionsProps) {
    const [liked, setLiked] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const [showReportOptions, setShowReportOptions] = useState(false);
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
    const [commentText, setCommentText] = useState('');
    const [isLiking, setIsLiking] = useState(false);
    const [comments, setComments] = useState(post.comments || []);
    const [currentPost, setCurrentPost] = useState(post);

    useEffect(() => {
        if (currentPost.liked.includes(userId)) {
            setLiked(true);
        }
        
    }, [currentPost, userId]);

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
                className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-10 max-h-[80vh] relative"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <button
                    onClick={handleCloseModal}
                    className="absolute top-2 left-2 text-gray-500 hover:text-gray-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <h2 className="text-xl font-bold mb-4 pr-8">Comments</h2>
                <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Enter your comment..."
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                />
                <button
                    onClick={handleCommentSubmit}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                >
                    Submit
                </button>
                
                <div className="mt-4 max-h-[40vh] overflow-y-auto">
                    <h3 className="text-lg font-medium mb-2">Existing Comments</h3>
                    {comments.length > 0 ? (
                        comments.map((comment:any) => (
                            <div key={comment._id} className="mb-4 p-2 border-b border-gray-200">
                                <p className="text-sm text-gray-700">
                                    <strong>{comment.userId?.name || 'Unknown User'}</strong>: {comment.text}
                                </p>
                                <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                            </div>
                        ))
                    ) : (
                        <p>No comments yet.</p>
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
        </div>
    );
}

export default PostActions;
