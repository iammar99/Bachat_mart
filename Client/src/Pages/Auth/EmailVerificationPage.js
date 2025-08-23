import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Spin, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';

const EmailVerificationPage = ({ setIsAuth, setUser, fetchData, fetchProfileData }) => {
  const [verificationStatus, setVerificationStatus] = useState('loading'); // loading, success, error
  const [verificationMessage, setVerificationMessage] = useState('');
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      handleEmailVerification(token);
    } else {
      setVerificationStatus('error');
      setVerificationMessage('Invalid verification link');
    }
  }, [token]);

  const handleEmailVerification = async (verificationToken) => {
    try {
      setVerificationStatus('loading');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/verify-email/${verificationToken}`, {
        method: "GET",
        credentials: "include"
      });
      
      const result = await response.json();
      
      if (result.success) {
        setVerificationStatus('success');
        setVerificationMessage(result.message);
        
        // Set user as authenticated
        const userData = {
          email: result.user.email,
          username: result.user.username,
          id: result.user._id,
          role: result.user.role,
          profile: result.profileImg || null
        };
        
        setIsAuth(true);
        setUser(userData);
        localStorage.setItem("token", "true");
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Remove pending email from storage
        localStorage.removeItem("pendingVerificationEmail");
        
        if (fetchData) fetchData();
        if (fetchProfileData) fetchProfileData(userData.id);
        
        message.success('Email verified successfully! Welcome!');
        
        
      } else {
        setVerificationStatus('error');
        setVerificationMessage(result.message);
        message.error(result.message);
      }
    } catch (error) {
      setVerificationStatus('error');
      setVerificationMessage('Verification failed. Please try again.');
      message.error("Verification failed. Please try again.");
      console.error("Verification error:", error);
    }
  };

  const handleResendVerification = async () => {
    try {
      const email = localStorage.getItem("pendingVerificationEmail");
      if (!email) {
        message.error("No pending verification found. Please register again.");
        navigate('/register');
        return;
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
      
      const result = await response.json();
      
      if (result.success) {
        message.success("Verification email resent successfully! Please check your inbox.");
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error("Failed to resend verification email");
      console.error("Resend error:", error);
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '90%'
      }}>
        {verificationStatus === 'loading' && (
          <>
            <Spin 
              indicator={<LoadingOutlined style={{ fontSize: 48, color: '#1890ff' }} spin />} 
            />
            <h2 style={{ marginTop: '20px', color: '#1890ff' }}>
              Verifying your email...
            </h2>
            <p style={{ color: '#666', marginTop: '10px' }}>
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {verificationStatus === 'success' && (
          <>
            <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
            <h2 style={{ marginTop: '20px', color: '#52c41a' }}>
              Email Verified Successfully!
            </h2>
            <p style={{ color: '#666', marginTop: '10px' }}>
              {verificationMessage}
            </p>
            <p style={{ color: '#999', marginTop: '15px' }}>
              You will be redirected to your dashboard in a few seconds...
            </p>
            <Button 
              type="primary" 
              size="large" 
              onClick={() => navigate('/dashboard')}
              style={{ marginTop: '20px' }}
            >
              Go to Dashboard Now
            </Button>
          </>
        )}

        {verificationStatus === 'error' && (
          <>
            <CloseCircleOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />
            <h2 style={{ marginTop: '20px', color: '#ff4d4f' }}>
              Verification Failed
            </h2>
            <p style={{ color: '#666', marginTop: '10px' }}>
              {verificationMessage}
            </p>
            
            <div style={{ marginTop: '30px' }}>
              <Button 
                type="primary" 
                onClick={handleResendVerification}
                style={{ marginRight: '10px' }}
              >
                Resend Verification Email
              </Button>
              <Button 
                onClick={goToLogin}
                style={{ marginRight: '10px' }}
              >
                Go to Login
              </Button>
              <Button 
                onClick={goToRegister}
              >
                Register Again
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationPage;