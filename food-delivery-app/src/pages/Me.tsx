import { FC, useCallback, useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';

import usePageTitle from '../hooks/usePageTitle';
import { useGetMe, useUpdateUser } from '../hooks/useApi';
import { AppAlertTypes } from '../types/AppAlert.Types';
import { useAlert } from '../hooks/useAppAlert';
import { UserDto, UserUpdateDto } from '../types/User.Types';
import MyAddresses from '../components/MyAddresses/MyAddresses';
import MyCards from '../components/MyCards/MyCards';
import MyVouchers from '../components/MyVouchers/MyVouchers';
import MyDataForm from '../components/User/MyDataForm';

const Me: FC = () => {
	usePageTitle('Me');
	const [, setAlertOptions] = useAlert();
	const { isError, data, error } = useGetMe();
	const [userData, setUserData] = useState<UserDto>();
	const qc = useQueryClient();
	const updateUserCall = useUpdateUser(qc);

	const updateUser = useCallback(async (updatedUser: UserUpdateDto) => {
		await updateUserCall.mutateAsync(updatedUser);
	}, []);

	useEffect(() => {
		setUserData(data ? data.data : undefined);
	}, [data]);

	useEffect(() => {
		if (isError) {
			setAlertOptions({
				showAlert: true,
				alertType: AppAlertTypes.Error,
				alertMessage: error?.message
			});
		}
	}, [isError]);

	return (
		<>
			{userData && <MyDataForm myData={userData} updateUser={updateUser} />}
			{userData && <MyAddresses userId={userData.id} />}
			{userData && <MyCards userId={userData.id} user={userData} />}
			{userData && <MyVouchers userId={userData.id} user={userData} />}
		</>
	);
};

export default Me;
