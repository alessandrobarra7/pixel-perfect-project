import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import loginBg from '@/assets/login-bg.png';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@portal.med');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/studies', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/studies', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img src={loginBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col justify-end p-10">
          <h2 className="text-3xl font-bold text-white tracking-tight">RadPortal</h2>
          <p className="mt-1 text-sm text-white/60">Sistema de Laudos Radiológicos</p>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[hsl(var(--background))] px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">RadPortal</h1>
            <p className="text-xs text-muted-foreground">Sistema de Laudos Radiológicos</p>
          </div>

          <h2 className="text-lg font-semibold text-foreground mb-1">Entrar</h2>
          <p className="text-xs text-muted-foreground mb-6">Informe suas credenciais</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded bg-destructive/10 p-2.5 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Senha</label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="h-9 text-sm"
              />
            </div>
            <Button type="submit" className="w-full h-9 text-sm" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 border-t border-border pt-4">
            <p className="text-[10px] font-medium text-muted-foreground mb-1">Usuários de teste:</p>
            <ul className="space-y-0.5 text-[10px] text-muted-foreground">
              <li><strong>admin@portal.med</strong> — Admin</li>
              <li><strong>maria@portal.med</strong> — Médica</li>
              <li><strong>ana@portal.med</strong> — Viewer</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
