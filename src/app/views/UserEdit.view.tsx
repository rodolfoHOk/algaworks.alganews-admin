import { Card, notification, Skeleton } from 'antd';
import moment from 'moment';
import { useCallback, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { User, UserService } from 'rodolfohiok-sdk';
import useBreadcrumb from '../../core/hooks/useBreadcrumb';
import usePageTitle from '../../core/hooks/usePageTitle';
import useUser from '../../core/hooks/useUser';
import NotFoundError from '../components/NotFoundError';
import UserForm from '../features/UserForm';

export default function UserEditView() {
  usePageTitle('Edição do usuário');
  useBreadcrumb('Usuários/Edição');
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, fetchUser, notFound } = useUser();

  useEffect(() => {
    if (!isNaN(Number(params.id))) fetchUser(Number(params.id));
  }, [fetchUser, params.id]);

  const transformUserData = useCallback((user: User.Detailed) => {
    return {
      ...user,
      createdAt: moment(user.createdAt),
      updatedAt: moment(user.updatedAt),
      birthdate: moment(user.birthdate),
    };
  }, []);

  async function handleUserUpdate(user: User.Input) {
    await UserService.updateExistingUser(Number(params.id), user).then(() => {
      navigate('/usuarios');
      notification.success({ message: 'Usuário foi atualizado com sucesso' });
    });
  }

  if (isNaN(Number(params.id))) return <Navigate to={'/usuarios'} />;

  if (notFound)
    return (
      <Card>
        <NotFoundError
          title="Usuário não encontrado"
          actionDestination="/usuarios"
          actionTitle="Voltar para a lista de usuários"
        />
      </Card>
    );

  if (!user) return <Skeleton />;

  return (
    <>
      <UserForm user={transformUserData(user)} onUpdate={handleUserUpdate} />
    </>
  );
}
