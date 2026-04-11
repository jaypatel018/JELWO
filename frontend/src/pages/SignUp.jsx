import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px 20px',
      minHeight: '60vh',
      background: 'white',
    }}>
      <SignUp
        routing="hash"
        signInUrl="/sign-in"
        afterSignUpUrl="/"
      />
    </div>
  );
};

export default SignUpPage;
