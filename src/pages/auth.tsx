import { useState } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';

import StepEmail from '@/components/auth/StepEmail';
import StepNameAge from '@/components/auth/StepNameAge';
import StepPassword from '@/components/auth/StepPassword';
import StepCongrats from '@/components/auth/StepCongrats';
import StepUsername from '@/components/auth/StepUsername';
import LoginOrSignup from '@/components/auth/LoginOrSignup';
import { supabase } from '@/lib/supabaseClient';

type Step =
  | 'login'
  | 'email'
  | 'name-age'
  | 'password'
  | 'congrats'
  | 'username'
  | 'summary'
  | 'loading'
  | 'error';

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('login');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    age: '',
    password: '',
    username: '',
    userId: '',
  });

  const stepOrder: Step[] = [
    'login',
    'email',
    'name-age',
    'password',
    'congrats',
    'username',
    'summary',
  ];

  const nextStep = (newData: any = {}) => {
    setFormData((prev) => ({ ...prev, ...newData }));
    const currentIndex = stepOrder.indexOf(step);
    setStep(stepOrder[currentIndex + 1]);
  };

  const prevStep = () => {
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex > 0) {
      setStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleLogin = async (credentials: { identifier: string; password: string }) => {
    try {
      const { identifier: email, password } = credentials;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        setErrorMessage('Invalid email or password.');
        setStep('error');
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Something went wrong. Please try again.');
      setStep('error');
    }
  };

  const generateUID = async (): Promise<string> => {
    let uid = '';
    let exists = true;

    while (exists) {
      uid = 'UID_' + Math.floor(Math.random() * 100000);
      const { data } = await supabase
        .from('users')
        .select('userid')
        .eq('userid', uid)
        .maybeSingle();

      exists = !!data;
    }

    return uid;
  };

  const handleUsernameSubmit = async (username: string) => {
    setStep('loading');
    const { email, name, age, password } = formData;

    if (!email || !name || !age || !password || !username) {
      setErrorMessage('Missing required fields. Please start over.');
      return setStep('error');
    }

    const numericAge = Number(age);
    if (isNaN(numericAge) || numericAge <= 0) {
      setErrorMessage('Invalid age. Please enter a number greater than 0.');
      return setStep('error');
    }

    try {
      const { data: existingUsername, error: usernameError } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .maybeSingle();

      if (usernameError) throw new Error('Error checking username.');
      if (existingUsername) {
        setErrorMessage('Username already in use. Please choose another.');
        return setStep('username');
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError || !authData?.user?.id) {
        throw new Error('Failed to create account in Supabase Auth.');
      }

      const supabaseUserId = authData.user.id;
      const userId = await generateUID();

      const { error: insertError } = await supabase.from('users').insert([
        {
          id: supabaseUserId,
          email,
          name,
          age: numericAge,
          username,
          userid: userId,
          avatar_url: '',
          created_at: new Date().toISOString(),
        },
      ]);

      if (insertError) {
        throw new Error('Error inserting user into users table.');
      }

      setFormData((prev) => ({ ...prev, userId, username }));
      setStep('summary');
    } catch (err: any) {
      console.error('Signup failed:', err.message);
      setErrorMessage('Something went wrong. Please try again.');
      setStep('error');
    }
  };

  const handleContinueFromSummary = () => {
    setStep('loading');
    setTimeout(() => {
      router.push('/login');
    }, 2000); // simulate loading before routing (optional)
  };

  const stepComponents = {
    login: (
      <LoginOrSignup
        onLogin={handleLogin}
        onSignupClick={() => setStep('email')}
      />
    ),
    email: (
      <StepEmail
        onNext={(data) => nextStep({ email: data })}
        onBack={prevStep}
        defaultValue={formData.email}
      />
    ),
    'name-age': (
      <StepNameAge
        onNext={(data) => nextStep(data)}
        onBack={prevStep}
        defaultValue={{ name: formData.name, age: formData.age }}
      />
    ),
    password: (
      <StepPassword
        onNext={(data) => nextStep({ password: data })}
        onBack={prevStep}
      />
    ),
    congrats: <StepCongrats onNext={() => nextStep()} />,
    username: (
      <StepUsername
        onNext={handleUsernameSubmit}
        defaultValue={formData.username}
      />
    ),
    summary: (
      <div className="space-y-4 text-center">
        <h2 className="text-lg font-semibold text-blue-700">
          🎉 Almost done!
        </h2>
        <p className="text-gray-700">
          Please check your email and click the verification link from Supabase to activate your account.
        </p>
        <p className="text-sm text-gray-500">
          You must verify your email before logging in.
        </p>
        <button
          onClick={handleContinueFromSummary}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          I have verified my email – Continue
        </button>
      </div>
    ),
    loading: (
      <div className="text-center py-8 font-medium text-blue-600">
        Setting up your dashboard, please wait...
      </div>
    ),
    error: (
      <div className="text-center text-red-600 space-y-4">
        <p className="font-semibold">{errorMessage}</p>
        <button
          onClick={() => setStep('login')}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Back to Login
        </button>
      </div>
    ),
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white p-6 rounded-xl shadow-xl"
        >
          {stepComponents[step]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
