import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowRight, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Brand from '../components/Brand'

export default function Register() {
  const { user, register: registerUser } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  if (user) return <Navigate to={user.role === 'STUDENT' ? '/student/dashboard' : '/dashboard'} replace />
  const submit = async (values) => { try { await registerUser(values); toast.success('Student account created successfully'); navigate('/student/dashboard') } catch (error) { toast.error(error.response?.data?.error?.message || 'Could not create your account.') } }
  return <div className="auth-page"><section className="auth-intro"><Brand light /><div className="auth-intro-copy"><span className="eyebrow"><Sparkles size={14} />CAMPUSFLOW AI</span><h1>Operations that feel effortless.</h1><p>Bring requests, approvals and auditability into one focused workflow.</p></div><div className="workflow-preview"><span>REQUEST</span><i /><span>AI</span><i /><span>APPROVAL</span><i /><span>ACTION</span></div></section><section className="auth-panel"><div className="auth-box"><div className="auth-mobile-brand"><Brand /></div><div className="auth-heading"><h2>Create your student account</h2><p>Public registration always creates a student account.</p></div><form onSubmit={handleSubmit(submit)} className="auth-form"><label>Full name<input placeholder="Your name" {...register('name', { required: 'Name is required.' })} />{errors.name && <small>{errors.name.message}</small>}</label><label>Email<input type="email" placeholder="you@college.edu" {...register('email', { required: 'Email is required.' })} />{errors.email && <small>{errors.email.message}</small>}</label><label>Password<input type="password" placeholder="At least 6 characters" {...register('password', { required: 'Password is required.', minLength: { value: 6, message: 'Use at least 6 characters.' } })} />{errors.password && <small>{errors.password.message}</small>}</label><button className="button button-primary auth-submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : <>Create student account <ArrowRight size={17} /></>}</button></form><p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p></div></section></div>
}
