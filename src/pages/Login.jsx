import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowRight, Eye, EyeOff, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Brand from '../components/Brand'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [portal, setPortal] = useState('STAFF')
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { email: 'admin@campusflow.ai', password: 'Admin@123' } })
  if (user) return <Navigate to={user.role === 'STUDENT' ? '/student/dashboard' : '/dashboard'} replace />

  const submit = async (values) => {
    try {
      setSubmitting(true)
      const loggedInUser = await login({ ...values, role: portal })
      const destination = loggedInUser.role === 'STUDENT' ? '/student/dashboard' : '/dashboard'
      toast.success(loggedInUser.role === 'STUDENT' ? 'Welcome to your student portal' : 'Welcome back to CampusFlow')
      navigate(destination)
    } catch { toast.error('Login failed. Please check your details.') }
    finally { setSubmitting(false) }
  }

  return <div className="auth-page"><section className="auth-intro"><Brand light /><div className="auth-intro-copy"><span className="eyebrow"><Sparkles size={14} />OPERATIONS, ORGANISED</span><h1>Turn repetitive college operations into intelligent workflows.</h1><p>CampusFlow AI turns every request into a clear, approval-controlled action.</p></div><div className="workflow-preview"><span>REQUEST</span><i /><span>AI</span><i /><span>APPROVAL</span><i /><span>ACTION</span></div><div className="intro-bottom"><ShieldCheck size={18} />Human approval stays in control</div></section><section className="auth-panel"><div className="auth-box"><div className="auth-mobile-brand"><Brand /></div><div className="auth-heading"><h2>Welcome back</h2><p>Select a portal, then sign in.</p></div><div className="role-picker" role="group" aria-label="Choose portal"><button type="button" onClick={() => setPortal('STAFF')} className={portal === 'STAFF' ? 'selected' : ''}><ShieldCheck size={17} /><span>Admin</span><small>Manage workflows</small></button><button type="button" onClick={() => setPortal('STUDENT')} className={portal === 'STUDENT' ? 'selected' : ''}><GraduationCap size={17} /><span>Student</span><small>Track requests</small></button></div><form onSubmit={handleSubmit(submit)} className="auth-form"><label>Email<input type="email" {...register('email', { required: 'Email is required.' })} />{errors.email && <small>{errors.email.message}</small>}</label><label>Password<div className="password-field"><input type={showPassword ? 'text' : 'password'} {...register('password', { required: 'Password is required.' })} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Show password">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{errors.password && <small>{errors.password.message}</small>}</label><button className="button button-primary auth-submit" disabled={submitting}>{submitting ? 'Signing in...' : <>Sign in <ArrowRight size={17} /></>}</button></form><div className="demo-credentials">In demo mode use any email and password. With the backend, the account role decides the portal.</div><p className="auth-switch">Don't have a student account? <Link to="/register">Create account</Link></p></div></section></div>
}
