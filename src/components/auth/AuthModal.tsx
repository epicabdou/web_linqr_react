import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { Mail, Lock, User, Github, Chrome, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { authActions, $loading, $error } from '../../stores/authStore';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultMode?: 'signin' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({
                                                 isOpen,
                                                 onClose,
                                                 defaultMode = 'signin'
                                             }) => {
    const [mode, setMode] = useState<'signin' | 'signup' | 'magic-link' | 'reset-password'>(defaultMode);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    });
    const [localError, setLocalError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const loading = useStore($loading);
    const error = useStore($error);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setLocalError(null);
        authActions.clearError();
    };

    const validateForm = () => {
        if (!formData.email.trim()) {
            setLocalError('Email is required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setLocalError('Please enter a valid email address');
            return false;
        }

        if (mode === 'signup') {
            if (!formData.firstName.trim()) {
                setLocalError('First name is required');
                return false;
            }
            if (!formData.lastName.trim()) {
                setLocalError('Last name is required');
                return false;
            }
            if (!formData.password) {
                setLocalError('Password is required');
                return false;
            }
            if (formData.password.length < 6) {
                setLocalError('Password must be at least 6 characters');
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setLocalError('Passwords do not match');
                return false;
            }
        }

        if (mode === 'signin' && !formData.password) {
            setLocalError('Password is required');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            let result;

            switch (mode) {
                case 'signup':
                    result = await authActions.signUp(
                        formData.email,
                        formData.password,
                        {
                            first_name: formData.firstName,
                            last_name: formData.lastName
                        }
                    );
                    if (result.success) {
                        setIsSuccess(true);
                    }
                    break;

                case 'signin':
                    result = await authActions.signIn(formData.email, formData.password);
                    if (result.success) {
                        onClose();
                    }
                    break;

                case 'magic-link':
                    result = await authActions.signInWithOTP(formData.email);
                    if (result.success) {
                        setIsSuccess(true);
                    }
                    break;

                case 'reset-password':
                    result = await authActions.resetPassword(formData.email);
                    if (result.success) {
                        setIsSuccess(true);
                    }
                    break;
            }
        } catch (err) {
            setLocalError('An unexpected error occurred');
        }
    };

    const handleOAuthSignIn = async (provider: 'google' | 'github') => {
        try {
            const result = await authActions.signInWithOAuth(provider);
            if (result.success) {
                // OAuth redirect will handle the rest
            }
        } catch (err) {
            setLocalError('OAuth sign in failed');
        }
    };

    const resetForm = () => {
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: ''
        });
        setLocalError(null);
        setIsSuccess(false);
        setShowPassword(false);
        setShowConfirmPassword(false);
        authActions.clearError();
    };

    const switchMode = (newMode: typeof mode) => {
        setMode(newMode);
        resetForm();
    };

    const renderSuccessState = () => (
        <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Check your email</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
                {mode === 'magic-link' && 'We sent you a magic link to sign in to your account.'}
                {mode === 'reset-password' && 'We sent you a password reset link.'}
                {mode === 'signup' && 'Please check your email to verify your account before signing in.'}
            </p>
            <Button
                onClick={() => switchMode('signin')}
                variant="outline"
                className="w-full"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
            </Button>
        </div>
    );

    const renderAuthForm = () => {
        const displayError = localError || error;

        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {mode === 'signin' && 'Welcome back'}
                        {mode === 'signup' && 'Create your account'}
                        {mode === 'magic-link' && 'Magic link sign in'}
                        {mode === 'reset-password' && 'Reset your password'}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {mode === 'signin' && 'Sign in to your LinQR account'}
                        {mode === 'signup' && 'Start building your digital business cards'}
                        {mode === 'magic-link' && 'We\'ll send you a magic link to sign in'}
                        {mode === 'reset-password' && 'Enter your email to receive a reset link'}
                    </p>
                </div>

                {/* OAuth Buttons */}
                {(mode === 'signin' || mode === 'signup') && (
                    <div className="space-y-3">
                        <Button
                            fullWidth
                            variant="outline"
                            onClick={() => handleOAuthSignIn('google')}
                            disabled={loading}
                            className="h-11"
                        >
                            <Chrome className="h-5 w-5 mr-3" />
                            Continue with Google
                        </Button>
                        <Button
                            fullWidth
                            variant="outline"
                            onClick={() => handleOAuthSignIn('github')}
                            disabled={loading}
                            className="h-11"
                        >
                            <Github className="h-5 w-5 mr-3" />
                            Continue with GitHub
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">or continue with email</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name fields for signup */}
                    {mode === 'signup' && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Input
                                    label="First Name"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    icon={User}
                                    required
                                    disabled={loading}
                                    fullWidth
                                />
                            </div>
                            <div>
                                <Input
                                    label="Last Name"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    icon={User}
                                    required
                                    disabled={loading}
                                    fullWidth
                                />
                            </div>
                        </div>
                    )}

                    {/* Email field */}
                    <Input
                        label="Email address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        icon={Mail}
                        required
                        disabled={loading}
                        fullWidth
                        placeholder="Enter your email"
                    />

                    {/* Password fields */}
                    {(mode === 'signin' || mode === 'signup') && (
                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                icon={Lock}
                                required
                                disabled={loading}
                                fullWidth
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                                disabled={loading}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    )}

                    {/* Confirm password for signup */}
                    {mode === 'signup' && (
                        <div className="relative">
                            <Input
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                icon={Lock}
                                required
                                disabled={loading}
                                fullWidth
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                                disabled={loading}
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    )}

                    {/* Error message */}
                    {displayError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm text-red-700">{displayError}</p>
                        </div>
                    )}

                    {/* Submit button */}
                    <Button
                        type="submit"
                        fullWidth
                        loading={loading}
                        disabled={loading}
                        className="h-11"
                    >
                        {mode === 'signin' && 'Sign In'}
                        {mode === 'signup' && 'Create Account'}
                        {mode === 'magic-link' && 'Send Magic Link'}
                        {mode === 'reset-password' && 'Send Reset Link'}
                    </Button>
                </form>

                {/* Footer links */}
                <div className="space-y-4">
                    {mode === 'signin' && (
                        <div className="space-y-3">
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => switchMode('magic-link')}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    disabled={loading}
                                >
                                    Sign in with magic link instead
                                </button>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Don't have an account?</span>
                                <button
                                    type="button"
                                    onClick={() => switchMode('signup')}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                    disabled={loading}
                                >
                                    Sign up
                                </button>
                            </div>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => switchMode('reset-password')}
                                    className="text-sm text-gray-600 hover:text-gray-800"
                                    disabled={loading}
                                >
                                    Forgot your password?
                                </button>
                            </div>
                        </div>
                    )}

                    {mode === 'signup' && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Already have an account?</span>
                                <button
                                    type="button"
                                    onClick={() => switchMode('signin')}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                    disabled={loading}
                                >
                                    Sign in
                                </button>
                            </div>

                            <div className="text-xs text-gray-500 leading-relaxed">
                                By creating an account, you agree to our{' '}
                                <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>.
                            </div>
                        </div>
                    )}

                    {(mode === 'magic-link' || mode === 'reset-password') && (
                        <div className="text-center">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Remember your password?</span>
                                <button
                                    type="button"
                                    onClick={() => switchMode('signin')}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                    disabled={loading}
                                >
                                    Sign in
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title=""
            size="md"
            showCloseButton={false}
            closeOnOverlayClick={false}
        >
            <div className="px-2 py-4">
                {isSuccess ? renderSuccessState() : renderAuthForm()}
            </div>
        </Modal>
    );
};

export default AuthModal;