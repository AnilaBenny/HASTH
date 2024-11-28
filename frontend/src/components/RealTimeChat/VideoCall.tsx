import React, { useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';



const VideoCall: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const userData = useSelector((state: any) => state.user.user);
  const userID = userData?._id || 'Unknown ID';
  const userName = userData?.name || 'Unknown Name';

  const handleLeaveRoom = async () => {
    console.log('User left the room');
    navigate('/chat');
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const setupVideoCall = async () => {
      try {
        const appID = parseInt(import.meta.env.VITE_ZEGO_APP_ID) || 264920886;
        const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET || '0df736b1775e44f208a99e5905fcaabf';

        if (!appID || !serverSecret) {
          console.error('App ID or Server Secret is missing.');
          return;
        }

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomId || '',
          userID,
          userName
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        console.log(zp, '');

        zp.joinRoom({
          container: containerRef.current,
          scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall }, 
          turnOnCameraWhenJoining: true,
          turnOnMicrophoneWhenJoining: true,
          onLeaveRoom: handleLeaveRoom,
        });
      } catch (error) {
        console.error('Error generating kit token:', error);
      }
    };

    setupVideoCall();
  }, [roomId, userName, userID, navigate]);

  return (
    <div className="w-full h-full" ref={containerRef} />
  );
};

export default VideoCall;