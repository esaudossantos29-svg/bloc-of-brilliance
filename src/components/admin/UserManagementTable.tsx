import React, { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  AdminUser, 
  useSuspendUser, 
  useUnsuspendUser, 
  useTogglePremium,
  useToggleAdminRole 
} from '@/hooks/useAdminUsers';
import { 
  MoreHorizontal, 
  Shield, 
  ShieldOff, 
  Crown,
  Ban,
  CheckCircle,
  Search,
  User,
  Dumbbell,
  UtensilsCrossed,
  Clock
} from 'lucide-react';

interface UserManagementTableProps {
  users: AdminUser[];
  isLoading: boolean;
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({ 
  users, 
  isLoading 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [suspendReason, setSuspendReason] = useState('');

  const suspendUser = useSuspendUser();
  const unsuspendUser = useUnsuspendUser();
  const togglePremium = useTogglePremium();
  const toggleAdmin = useToggleAdminRole();

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSuspendClick = (user: AdminUser) => {
    setSelectedUser(user);
    setSuspendReason('');
    setSuspendDialogOpen(true);
  };

  const handleConfirmSuspend = () => {
    if (selectedUser && suspendReason.trim()) {
      suspendUser.mutate({ userId: selectedUser.user_id, reason: suspendReason });
      setSuspendDialogOpen(false);
      setSelectedUser(null);
      setSuspendReason('');
    }
  };

  const getGoalLabel = (goal: string | null) => {
    const goals: Record<string, string> = {
      'weight_loss': 'Emagrecimento',
      'muscle_gain': 'Ganho Muscular',
      'maintenance': 'Manutenção',
      'hypertrophy': 'Hipertrofia',
    };
    return goals[goal || ''] || goal || '-';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Atividade</TableHead>
              <TableHead>Última Atividade</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className={user.is_suspended ? 'bg-destructive/5' : ''}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback>
                          <User className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {user.name || 'Sem nome'}
                          {user.role === 'admin' && (
                            <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                              <Shield className="w-3 h-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {getGoalLabel(user.fitness_goal)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.is_suspended ? (
                        <Badge variant="destructive" className="text-xs">
                          <Ban className="w-3 h-3 mr-1" />
                          Suspenso
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ativo
                        </Badge>
                      )}
                      {user.is_premium && (
                        <Badge className="text-xs bg-gradient-to-r from-purple-600 to-purple-500">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground" title="Treinos">
                        <Dumbbell className="w-4 h-4" />
                        <span>{user.workoutCount}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground" title="Refeições">
                        <UtensilsCrossed className="w-4 h-4" />
                        <span>{user.mealCount}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.lastActivity ? (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(user.lastActivity), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/* Premium toggle */}
                        <DropdownMenuItem
                          onClick={() => togglePremium.mutate({ 
                            userId: user.user_id, 
                            isPremium: !user.is_premium 
                          })}
                        >
                        {user.is_premium ? (
                            <>
                              <Crown className="w-4 h-4 mr-2 opacity-50" />
                              Remover Premium
                            </>
                          ) : (
                            <>
                              <Crown className="w-4 h-4 mr-2" />
                              Tornar Premium
                            </>
                          )}
                        </DropdownMenuItem>

                        {/* Admin toggle */}
                        <DropdownMenuItem
                          onClick={() => toggleAdmin.mutate({ 
                            userId: user.user_id, 
                            isAdmin: user.role !== 'admin' 
                          })}
                        >
                          {user.role === 'admin' ? (
                            <>
                              <ShieldOff className="w-4 h-4 mr-2" />
                              Remover Admin
                            </>
                          ) : (
                            <>
                              <Shield className="w-4 h-4 mr-2" />
                              Tornar Admin
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* Suspend/Unsuspend */}
                        {user.is_suspended ? (
                          <DropdownMenuItem
                            onClick={() => unsuspendUser.mutate(user.user_id)}
                            className="text-green-600"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Remover Suspensão
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleSuspendClick(user)}
                            className="text-destructive"
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Suspender Usuário
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Suspend Dialog */}
      <AlertDialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspender Usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Suspender <strong>{selectedUser?.name || 'este usuário'}</strong>. 
              O usuário não poderá acessar o aplicativo enquanto estiver suspenso.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium">Motivo da suspensão</label>
            <Textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="Descreva o motivo da suspensão..."
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSuspend}
              disabled={!suspendReason.trim()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmar Suspensão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
