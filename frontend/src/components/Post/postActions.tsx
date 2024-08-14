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
    const [saved, setSaved] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const [showReportOptions, setShowReportOptions] = useState(false);
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
    const [commentText, setCommentText] = useState('');
    const [isLiking, setIsLiking] = useState(false);
    const [comments, setComments] = useState(post.comments || []);

    useEffect(() => {
        if (post.liked.includes(userId)) {
            setLiked(true);
        }
        if (post.saved.includes(userId)) {
            setSaved(true);
        }
    }, [post, userId]);

    const handleLike = async () => {
        if (isLiking) return;
        setIsLiking(true);

        try {
            const response = await axiosInstance.post('/api/auth/liked', { userId, postId: post._id });
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

    const handleSave = async () => {
        try {
            const response = await axiosInstance.post('/api/auth/saved', { userId, postId: post._id });
            if (response.data.status) {
                setSaved(!saved);
            }
        } catch (error) {
            console.error('Error saving post:', error);
        }
    };

    const handleComment = () => {
        setShowComment(true);
    };

    const handleCommentSubmit = async () => {
        try {
            const response = await axiosInstance.post('/api/auth/comment', { userId, postId: post._id, text: commentText });
            console.log(response);
            
            if (response.data.status) {
                setCommentsCount(prevCount => prevCount + 1);
                setComments((prevComments:any) => [...prevComments, response.data.data.comments]);
                setCommentText('');
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
                    className={`flex items-center space-x-1 px-3 py-2 rounded-full transition-colors duration-200 ${
                        saved ? 'bg-green-500 text-white' : 'bg-white text-gray-700 hover:bg-green-100'
                    }`}
                    onClick={handleSave}
                >
                    <span className="text-xl">🔖</span>
                    <span>{saved ? 'Saved' : 'Save'}</span>
                </button>
                <button
                    className="flex items-center space-x-1 px-3 py-2 bg-white text-gray-700 rounded-full hover:bg-red-100 transition-colors duration-200"
                    onClick={() => setShowReportOptions(!showReportOptions)}
                >
                    <span className="text-xl">⚠️</span>
                    <span>Report</span>
                </button>
            </div>

            <Modal
                isOpen={showComment}
                onRequestClose={handleCloseModal}
                contentLabel="Comments Modal"
                className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-10"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-xl font-bold mb-4">Comments</h2>
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

                <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Existing Comments</h3>
                    {
                    comments.length > 0 ? (
                        comments.map((comment:any) => (
                            <div key={comment._id} className="mb-4 p-2 border-b border-gray-200">
                                <p className="text-sm text-gray-700"><strong>{comment.userId.name}</strong>: {comment.text}</p>
                                <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                            </div>
                        ))
                    ) : (
                        <p>No comments yet.</p>
                    )}
                </div>

                <button
                    onClick={handleCloseModal}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                >
                    Close
                </button>
            </Modal>
        </div>
    );
}

export default PostActions;
