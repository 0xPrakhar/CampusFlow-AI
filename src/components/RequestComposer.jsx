import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ArrowRight, CheckCircle2, LoaderCircle, Sparkles, WandSparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { createRequest } from '../api/requests'
import PriorityBadge from './PriorityBadge'
import StatusBadge from './StatusBadge'

const demoText = 'Sir mujhe internship mil gayi hai, Friday tak NOC chahiye.'

export default function RequestComposer({ onCreated, onClose, student }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({ defaultValues: { message: '' } })
  const [phase, setPhase] = useState('form')
  const [result, setResult] = useState(null)
  const message = watch('message')

  const submit = async (values) => {
    try {
      setPhase('loading')
      const request = await createRequest({ ...values, student })
      setResult(request)
      setPhase('result')
      toast.success('AI analysis completed')
      onCreated?.(request)
    } catch {
      setPhase('form')
      toast.error("CampusFlow couldn't process this request.")
    }
  }

  if (phase === 'loading') return <section className="composer-card composer-loading"><div className="ai-orb"><LoaderCircle size={27} /></div><h2>Understanding request...</h2><p>Extracting important information and preparing the workflow.</p><div className="loading-lines"><span /><span /><span /></div></section>

  if (phase === 'result') return <section className="composer-card analysis-result"><div className="analysis-heading"><div><span className="eyebrow"><Sparkles size={14} />AI ANALYSIS</span><h2>{result.title}</h2><p>{result.summary}</p></div><div className="analysis-badges"><PriorityBadge priority={result.priority} /><StatusBadge status={result.status} /></div></div><div className="analysis-grid"><div><span>Deadline</span><strong>{result.deadline}</strong></div><div><span>Suggested action</span><strong>{result.suggestedAction}</strong></div><div><span>Category</span><strong>{result.category}</strong></div></div><div className="understanding"><CheckCircle2 size={17} /><div><strong>AI understanding</strong><p>{result.aiUnderstanding}</p></div></div><div className="composer-result-actions"><button className="button button-ghost" onClick={() => { setPhase('form'); setValue('message', '') }}>Create another</button><button className="button button-primary" onClick={() => onClose?.(result.id)}>Open request <ArrowRight size={16} /></button></div></section>

  return <section className="composer-card"><div className="composer-heading"><span className="eyebrow"><Sparkles size={14} />AI INTAKE</span><h2>Submit a request</h2><p>Describe the request naturally. CampusFlow AI will understand and organise it.</p></div><form onSubmit={handleSubmit(submit)}><textarea {...register('message', { required: 'Describe the request before analysing it.' })} placeholder="e.g. Sir mujhe internship mil gayi hai, Friday tak NOC chahiye." rows="5" /><div className="form-error">{errors.message?.message}</div><div className="composer-footer"><button type="button" className="demo-link" onClick={() => setValue('message', demoText)}><WandSparkles size={15} />Try demo request</button><button type="submit" className="button button-primary" disabled={!message?.trim()}>Analyze with AI <ArrowRight size={16} /></button></div></form></section>
}
