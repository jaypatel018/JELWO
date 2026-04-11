import { SignIn } from '@clerk/clerk-react';

const SignInPage = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px 20px',
      minHeight: '60vh',
      background: 'white',
    }}>
      <SignIn
        routing="hash"
        signUpUrl="/sign-up"
        forceRedirectUrl="/"
      />
    </div>
  );
};

export default SignInPage;
