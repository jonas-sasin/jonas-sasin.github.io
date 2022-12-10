import { FC, useCallback, useEffect, useState } from 'react';
import {
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography
} from '@mui/material';
import { useQueryClient } from 'react-query';

import {
	CardCreateDto,
	CardDto,
	MyCardsProps
} from '../../types/Payment.Types';
import { useDeleteCard, useGetCards, usePostCard } from '../../hooks/useApi';
import { AppAlertTypes } from '../../types/AppAlert.Types';
import { useAlert } from '../../hooks/useAppAlert';
import CardDialog from '../CardDialog/CardDialog';

const MyCards: FC<MyCardsProps> = ({ userId, user }) => {
	const qc = useQueryClient();
	const [, setAlertOptions] = useAlert();
	const [cardDialogOpened, setCardDialogOpened] = useState(false);
	const [myCards, setMyCards] = useState<CardDto[] | undefined>();
	const { isError, data, error } = useGetCards();
	const cardDeleteCall = useDeleteCard(qc);
	const cardCreateCall = usePostCard(qc);

	const handleOpenCardDialog = useCallback(() => {
		setCardDialogOpened(true);
	}, []);

	const handleCloseCardDialog = useCallback(() => {
		setCardDialogOpened(false);
	}, []);

	const createCard = useCallback(async (card: CardCreateDto) => {
		await cardCreateCall.mutateAsync(card);
	}, []);

	const deleteCard = useCallback(async (cardId: string) => {
		await cardDeleteCall.mutateAsync(cardId);
	}, []);

	useEffect(() => {
		setMyCards(data ? data.data : undefined);
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
			<CardDialog
				userId={userId}
				user={user}
				cardDialogOpened={cardDialogOpened}
				handleCloseCardDialog={handleCloseCardDialog}
				createCard={createCard}
			/>
			<Typography variant="h4" component="h2" textAlign="center" mb={3}>
				My cards
			</Typography>

			<TableContainer component={Paper}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Card number</TableCell>
							<TableCell>Expiration</TableCell>
							<TableCell />
						</TableRow>
					</TableHead>
					<TableBody>
						{myCards?.map(
							row =>
								!row.deleted && (
									<TableRow
										key={row.id}
										sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
									>
										<TableCell scope="row">{row.number}</TableCell>
										<TableCell scope="row">
											{new Date(row.expirationDate).toLocaleDateString()}
										</TableCell>
										<TableCell component="th" scope="row" align="right">
											<Button onClick={() => deleteCard(row.id)}>Delete</Button>
										</TableCell>
									</TableRow>
								)
						)}
						<TableRow
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
						>
							<TableCell component="th" scope="row" align="left">
								<Button onClick={handleOpenCardDialog}>Create</Button>
							</TableCell>
							<TableCell component="th" scope="row" />
							<TableCell component="th" scope="row" />
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

export default MyCards;
