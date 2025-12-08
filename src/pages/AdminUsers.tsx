import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { UserManagementTable } from '@/components/admin/UserManagementTable';
import { toast } from 'sonner';
import { 
  Shield, 
  Users, 
  ArrowLeft,
  ShieldAlert,
  RefreshCw,
  Crown,
  Ban,
  Activity
} from 'lucide-react';

const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const { data: users, isLoading: usersLoading, refetch } = useAdminUsers();

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast.error('Acesso negado - Área restrita a administradores');
      navigate('/workouts');
    }
  }, [adminLoading, isAdmin, navigate]);

  if (adminLoading) {
    return (
      <Layout>
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
              <Skeleton className="w-48 h-6 mx-auto mb-2" />
              <Skeleton className="w-32 h-4 mx-auto" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <Card className="p-12 text-center">
            <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <h1 className="text-2xl font-bold mb-2">Acesso Negado</h1>
            <p className="text-muted-foreground">
              Esta área é restrita a administradores.
            </p>
          </Card>
        </div>
      </Layout>
    );
  }

  // Calculate summary stats
  const totalUsers = users?.length || 0;
  const premiumUsers = users?.filter(u => u.is_premium).length || 0;
  const suspendedUsers = users?.filter(u => u.is_suspended).length || 0;
  const activeToday = users?.filter(u => {
    if (!u.lastActivity) return false;
    const today = new Date().toDateString();
    return new Date(u.lastActivity).toDateString() === today;
  }).length || 0;

  const summaryCards = [
    { label: 'Total de Usuários', value: totalUsers, icon: Users, color: 'text-blue-500' },
    { label: 'Premium', value: premiumUsers, icon: Crown, color: 'text-purple-500' },
    { label: 'Suspensos', value: suspendedUsers, icon: Ban, color: 'text-destructive' },
    { label: 'Ativos Hoje', value: activeToday, icon: Activity, color: 'text-green-500' },
  ];

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Link to="/admin">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold">Gerenciamento de Usuários</h1>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                    <Shield className="w-3 h-3" />
                    Admin
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Visualize perfis, atividade e modere contas
                </p>
              </div>
            </div>
            <Button 
              onClick={() => refetch()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <div className="text-xs text-muted-foreground">{card.label}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Users Table */}
        <Card className="p-6">
          <UserManagementTable users={users || []} isLoading={usersLoading} />
        </Card>
      </div>
    </Layout>
  );
};

export default AdminUsers;
