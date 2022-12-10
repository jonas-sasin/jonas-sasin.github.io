import { FC, useCallback, useEffect, useState } from 'react';
import {
	Button,
	Paper,
	styled,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableHead,
	TableRow,
	Typography
} from '@mui/material';
import { useQueryClient } from 'react-query';
import { AddBox } from '@mui/icons-material';

import { CategoryDto } from '../../types/Shared.Types';
import {
	useDeleteItemCategory,
	useDeleteRestaurantCategory
} from '../../hooks/useApi';
import { useAlert } from '../../hooks/useAppAlert';
import { AppAlertTypes } from '../../types/AppAlert.Types';
import ConfirmDeleteDialog from '../Shared/ConfirmDeleteDialog';

import AddCategory from './AddCategory';

export type CategoryTableProps = {
	cats?: CategoryDto[];
	isItem: boolean;
};
const CategoryTable: FC<CategoryTableProps> = ({ cats, isItem }) => {
	const qc = useQueryClient();
	const [, setAlertOptions] = useAlert();

	const [categories, setCategories] = useState(cats);

	const deleteRestaurantCategory = useDeleteRestaurantCategory(qc);
	const deleteItemCategory = useDeleteItemCategory(qc);

	const StyledTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
			backgroundColor: theme.palette.common.black,
			color: theme.palette.common.white
		},
		[`&.${tableCellClasses.body}`]: {
			fontSize: 14
		}
	}));

	useEffect(() => {
		setCategories(cats);
	}, [categories, cats]);

	const onDeleteClick = useCallback(async (id?: string) => {
		try {
			if (isItem) {
				await deleteItemCategory.mutateAsync(id ?? '');
			} else {
				await deleteRestaurantCategory.mutateAsync(id ?? '');
			}
			if (categories) {
				let newCategories = [...categories];
				newCategories = newCategories.filter(cat => cat.id !== id);
				setCategories(newCategories);
			}
		} catch (e) {
			setAlertOptions({
				showAlert: true,
				alertType: AppAlertTypes.Error,
				alertMessage: 'Unknown error occurred. Category might not be empty'
			});
		}
	}, []);

	return (
		<TableContainer component={Paper}>
			<Table aria-label="simple table">
				<TableHead>
					<TableRow>
						<StyledTableCell>
							<Typography variant="h6">Category name</Typography>
						</StyledTableCell>
						<StyledTableCell>
							<Typography variant="h6">Description</Typography>
						</StyledTableCell>
						<StyledTableCell>
							<AddCategory isItem={isItem}>
								{open => (
									<Button onClick={open} variant="contained">
										<AddBox />
									</Button>
								)}
							</AddCategory>
						</StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{categories?.map(cat => (
						<TableRow
							key={cat.id}
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
						>
							<TableCell component="th" scope="row">
								{cat.name}
							</TableCell>
							<TableCell>{cat.description}</TableCell>
							<TableCell style={{ width: 50 }} align="right">
								<ConfirmDeleteDialog onClick={() => onDeleteClick(cat.id)}>
									Really want to delete category {`'${cat.name}'`}? Will not be
									successful if category not empty.
								</ConfirmDeleteDialog>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default CategoryTable;
