import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAdminUserProfile } from '../hooks/useGetAdminUserProfile';
import { useGetAllUsers } from '../hooks/useGetAllUsers';
import { useSearchUsersByEmail } from '../hooks/useSearchUsersByEmail';
import { useSetUserPremiumStatus } from '../hooks/useSetUserPremiumStatus';
import { useSetUserAdminStatus } from '../hooks/useSetUserAdminStatus';
import { Shield, Search, Loader2, Crown, User, Mail, Building2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: adminUserProfile, isLoading: profileLoading, isError, error, isFetched } = useGetAdminUserProfile();
  const { data: allUsers, isLoading: usersLoading } = useGetAllUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: searchResults } = useSearchUsersByEmail(searchTerm);
  const setPremiumStatus = useSetUserPremiumStatus();
  const setAdminStatus = useSetUserAdminStatus();

  const isAuthenticated = !!identity;

  const displayUsers = searchTerm.trim() ? searchResults || [] : allUsers || [];

  const handleTogglePremium = async (principal: string, currentStatus: boolean) => {
    try {
      await setPremiumStatus.mutateAsync({ principal, isPremium: !currentStatus });
      toast.success(`Premium status ${!currentStatus ? 'granted' : 'revoked'} successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update premium status');
      console.error('Premium status update error:', error);
    }
  };

  const handleToggleAdmin = async (principal: string, currentStatus: boolean) => {
    try {
      await setAdminStatus.mutateAsync({ principal, isAdmin: !currentStatus });
      toast.success(`Admin status ${!currentStatus ? 'granted' : 'revoked'} successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update admin status');
      console.error('Admin status update error:', error);
    }
  };

  if (!isAuthenticated) {
    navigate({ to: '/' });
    return null;
  }

  if (profileLoading) {
    return (
      <div className="container py-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Verifying admin access...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-20">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="p-4 rounded-full bg-destructive/10 w-20 h-20 mx-auto flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Error Loading Admin Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            {error?.message || 'Unable to verify admin status. Please try again.'}
          </p>
          <button
            onClick={() => navigate({ to: '/' })}
            className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition-opacity"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isFetched && adminUserProfile?.isAdmin !== true) {
    return (
      <div className="container py-20">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="p-4 rounded-full bg-destructive/10 w-20 h-20 mx-auto flex items-center justify-center">
            <XCircle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>
          <p className="text-lg text-muted-foreground">
            You do not have permission to access the admin dashboard.
          </p>
          <button
            onClick={() => navigate({ to: '/' })}
            className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition-opacity"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/20">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground">
          Manage users, grant premium access, and assign admin roles
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
          />
        </div>
      </div>

      {usersLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : displayUsers.length === 0 ? (
        <div className="text-center py-20">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">
            {searchTerm.trim() ? 'No users found matching your search' : 'No users found'}
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">College</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Premium</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Admin</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {displayUsers.map((user, index) => {
                  const isCurrentUser = user.email === adminUserProfile?.email;
                  
                  return (
                    <tr key={index} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-chart-1/20 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            {user.department && (
                              <p className="text-xs text-muted-foreground">{user.department}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          {user.college}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {user.isPremium ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                            <CheckCircle className="h-3 w-3" />
                            Premium
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                            Free
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {user.isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            <Shield className="h-3 w-3" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                            User
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleTogglePremium(user.email, user.isPremium)}
                            disabled={setPremiumStatus.isPending}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              user.isPremium
                                ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                                : 'bg-success/10 text-success hover:bg-success/20'
                            } disabled:opacity-50`}
                          >
                            {setPremiumStatus.isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <Crown className="h-3 w-3 inline mr-1" />
                                {user.isPremium ? 'Revoke' : 'Grant'}
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleToggleAdmin(user.email, user.isAdmin)}
                            disabled={setAdminStatus.isPending || isCurrentUser}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              user.isAdmin
                                ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                                : 'bg-primary/10 text-primary hover:bg-primary/20'
                            } disabled:opacity-50`}
                            title={isCurrentUser ? 'Cannot modify your own admin status' : ''}
                          >
                            {setAdminStatus.isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <Shield className="h-3 w-3 inline mr-1" />
                                {user.isAdmin ? 'Revoke' : 'Grant'}
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> Premium access grants users the ability to use AI-powered features like quiz generation and viva questions. 
          Admin access allows users to manage other users and configure system settings.
        </p>
      </div>
    </div>
  );
}
