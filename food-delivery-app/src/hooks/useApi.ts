import axios, { AxiosError, AxiosResponse } from 'axios';
import { QueryClient, useMutation, useQuery } from 'react-query';

import { apiRoutes } from '../api/apiRoutes';
import { AddressDto, AddressUpsertDto } from '../types/Address.Types';
import { ItemDto, ItemUpsertDto } from '../types/Item.Types';
import { OrderDto, OrderUpsertDto } from '../types/Order.Types';
import { CardCreateDto, CardDto, VoucherDto } from '../types/Payment.Types';
import {
	RestaurantDto,
	RestaurantsQueryParams,
	RestaurantUpsertDto
} from '../types/Restaurant.Types';
import { LoginDto, UserDto, UserUpdateDto } from '../types/User.Types';
import { CategoryDto, CategoryUpsertDto } from '../types/Shared.Types';
import { RatingDto, RatingUpsertDto } from '../types/Rating.Types';

export const getObjects = async <T>(url: string) =>
	axios.get<T>(url, { withCredentials: true });

export const postObject = async <T, K>(url: string, obj: K) => {
	const result = await axios.post<T>(url, obj, { withCredentials: true });
	return result.data;
};

export const putObject = async <T, K>(url: string, obj: K) => {
	const result = await axios.put<T>(url, obj, { withCredentials: true });
	return result.data;
};

export const deleteObject = async <T>(url: string) => {
	const result = await axios.delete<T>(url, { withCredentials: true });
	return result.data;
};

export const getRestaurantsWithParams = async <T>(
	url: string,
	params: RestaurantsQueryParams
) => axios.get<T>(url, { withCredentials: true, params });

export const useGetItemReviews = (id: string) =>
	useQuery<AxiosResponse<RatingDto[]>, AxiosError>(
		['list', id, 'itemRatings'],
		() => getObjects<RatingDto[]>(`${apiRoutes.reviewUrl}/item/${id}`)
	);

export const useGetRestaurantReviews = (id: string) =>
	useQuery<AxiosResponse<RatingDto[]>, AxiosError>(
		['list', id, 'restaurantRatings'],
		() => getObjects<RatingDto[]>(`${apiRoutes.reviewUrl}/restaurant/${id}`)
	);

export const usePostReview = (qc: QueryClient) =>
	useMutation((r: RatingUpsertDto) => postObject(apiRoutes.reviewUrl, r), {
		onSuccess: async () => {
			await qc.invalidateQueries();
		}
	});

export const useDeleteReview = (qc: QueryClient) =>
	useMutation((rId: string) => deleteObject(`${apiRoutes.reviewUrl}/${rId}`), {
		onSuccess: async () => {
			await qc.invalidateQueries();
		}
	});
export const useGetRestaurantsFilteredAndPaged = (
	params: RestaurantsQueryParams
) =>
	useQuery<AxiosResponse<RestaurantDto[]>, AxiosError>(
		[
			'list',
			'restaurants',
			params.categoryId,
			params.minAvgRating,
			params.page,
			params.pageSize
		],
		() =>
			getRestaurantsWithParams<RestaurantDto[]>(
				apiRoutes.restaurantsUrl,
				params
			)
	);

export const useGetRestaurantsFilteredCount = (
	params: RestaurantsQueryParams
) =>
	useQuery<AxiosResponse<number>, AxiosError>(
		['list', 'restaurantsCount', params.categoryId, params.minAvgRating],
		() =>
			getRestaurantsWithParams<number>(
				`${apiRoutes.restaurantsUrl}/count`,
				params
			)
	);

export const useGetItem = (itemId: string) =>
	useQuery<AxiosResponse<ItemDto>, AxiosError>(['get', itemId, 'item'], () =>
		getObjects<ItemDto>(`${apiRoutes.itemsUrl}/${itemId}`)
	);

export const useGetRestaurant = (restaurantId: string) =>
	useQuery<AxiosResponse<RestaurantDto>, AxiosError>(
		['get', restaurantId, 'restaurant'],
		() =>
			getObjects<RestaurantDto>(`${apiRoutes.restaurantsUrl}/${restaurantId}`)
	);

export const usePostRestaurant = (qc: QueryClient) =>
	useMutation(
		(r: RestaurantUpsertDto) => postObject(apiRoutes.restaurantsUrl, r),
		{
			onSuccess: async () => {
				await qc.invalidateQueries();
			}
		}
	);

export const useUpdateRestaurant = (qc: QueryClient, restaurantId: string) =>
	useMutation(
		(r: RestaurantUpsertDto) =>
			putObject(`${apiRoutes.restaurantsUrl}/${restaurantId}`, r),
		{
			onSuccess: async () => {
				await qc.invalidateQueries();
			}
		}
	);

export const useDeleteRestaurant = (qc: QueryClient) =>
	useMutation(
		(rId: string) => deleteObject(`${apiRoutes.restaurantsUrl}/${rId}`),
		{
			onSuccess: async () => {
				await qc.invalidateQueries();
			}
		}
	);

export const useGetItemsForRestaurant = (restaurantId: string) =>
	useQuery<AxiosResponse<ItemDto[]>, AxiosError>(
		['list', restaurantId, 'items'],
		() =>
			getObjects<ItemDto[]>(`${apiRoutes.itemsUrl}/restaurant/${restaurantId}`)
	);

export const usePostItem = (qc: QueryClient) =>
	useMutation((r: ItemUpsertDto) => postObject(apiRoutes.itemsUrl, r), {
		onSuccess: async () => {
			await qc.invalidateQueries();
		}
	});

export const useUpdateItem = (qc: QueryClient, id: string) =>
	useMutation(
		(r: ItemUpsertDto) => putObject(`${apiRoutes.itemsUrl}/${id}`, r),
		{
			onSuccess: async () => {
				await qc.invalidateQueries();
			}
		}
	);

export const useDeleteItem = (qc: QueryClient) =>
	useMutation((iId: string) => deleteObject(`${apiRoutes.itemsUrl}/${iId}`), {
		onSuccess: async () => {
			await qc.invalidateQueries();
		}
	});

export const useGetOrders = () =>
	useQuery<AxiosResponse<OrderDto[]>, AxiosError>(['list', 'orders'], () =>
		getObjects<OrderDto[]>(`${apiRoutes.ordersUrl}`)
	);

export const useGetAllOrders = () =>
	useQuery<AxiosResponse<OrderDto[]>, AxiosError>(['list', 'orders'], () =>
		getObjects<OrderDto[]>(`${apiRoutes.allOrdersUrl}`)
	);

export const useGetOrder = (orderId: string) =>
	useQuery<AxiosResponse<OrderDto>, AxiosError>(
		['get', orderId, 'orders'],
		() => getObjects<OrderDto>(`${apiRoutes.ordersUrl}/${orderId}`)
	);

export const useGetRestaurantCategories = () =>
	useQuery<AxiosResponse<CategoryDto[]>, AxiosError>(
		['list', 'restaurantCategories'],
		() => getObjects<CategoryDto[]>(apiRoutes.restaurantCategoriesUrl)
	);

export const usePostRestaurantCategory = (qc: QueryClient) =>
	useMutation(
		(newCategory: CategoryUpsertDto) =>
			postObject(apiRoutes.restaurantCategoriesUrl, newCategory),
		{
			onSuccess: async () => {
				await qc.invalidateQueries();
			}
		}
	);

export const useDeleteRestaurantCategory = (qc: QueryClient) =>
	useMutation(
		(categoryId: string) =>
			deleteObject(`${apiRoutes.restaurantCategoriesUrl}/${categoryId}`),
		{
			onSuccess: async () => {
				await qc.invalidateQueries();
			}
		}
	);

export const useGetItemCategories = () =>
	useQuery<AxiosResponse<CategoryDto[]>, AxiosError>(
		['list', 'itemCategories'],
		() => getObjects<CategoryDto[]>(apiRoutes.itemCategoriesUrl)
	);

export const usePostItemCategory = (qc: QueryClient) =>
	useMutation(
		(newCategory: CategoryUpsertDto) =>
			postObject(apiRoutes.itemCategoriesUrl, newCategory),
		{
			onSuccess: async () => {
				await qc.invalidateQueries();
			}
		}
	);

export const useDeleteItemCategory = (qc: QueryClient) =>
	useMutation(
		(categoryId: string) =>
			deleteObject(`${apiRoutes.itemCategoriesUrl}/${categoryId}`),
		{
			onSuccess: async () => {
				await qc.invalidateQueries();
			}
		}
	);

export const useGetAddresses = () =>
	useQuery<AxiosResponse<AddressDto[]>, AxiosError>(['list', 'addresses'], () =>
		getObjects<AddressDto[]>(apiRoutes.addressesUrl)
	);

export const usePostAddress = (qc: QueryClient) =>
	useMutation(
		(newAddress: AddressUpsertDto) =>
			postObject(`${apiRoutes.addressesUrl}`, newAddress),
		{
			onSuccess: async () => {
				await qc.invalidateQueries();
			}
		}
	);

export const useUpdateAddress = (qc: QueryClient) =>
	useMutation(
		(updatedAddress: AddressUpsertDto) =>
			putObject(
				`${apiRoutes.addressesUrl}/${updatedAddress.id}`,
				updatedAddress
			),
		{
			onSuccess: async () => {
				await qc.invalidateQueries();
			}
		}
	);

export const useDeleteAddress = (qc: QueryClient) =>
	useMutation(
		(addressId: string) =>
			deleteObject(`${apiRoutes.addressesUrl}/${addressId}`),
		{
			onSuccess: async () => {
				await qc.invalidateQueries();
			}
		}
	);

export const useGetCards = () =>
	useQuery<AxiosResponse<CardDto[]>, AxiosError>(['list', 'cards'], () =>
		getObjects<CardDto[]>(`${apiRoutes.cardsUrl}`)
	);

export const usePostCard = (qc: QueryClient) =>
	useMutation(
		(newCard: CardCreateDto) => postObject(`${apiRoutes.cardsUrl}`, newCard),
		{
			onSuccess: async () => {
				await qc.invalidateQueries();
			}
		}
	);

export const useDeleteCard = (qc: QueryClient) =>
	useMutation(
		(cardId: string) => deleteObject(`${apiRoutes.cardsUrl}/${cardId}`),
		{
			onSuccess: async () => {
				await qc.invalidateQueries();
			}
		}
	);

export const useGetVouchers = () =>
	useQuery<AxiosResponse<VoucherDto[]>, AxiosError>(['list', 'vouchers'], () =>
		getObjects<VoucherDto[]>(apiRoutes.vouchersUrl)
	);

export const usePostVoucher = (qc: QueryClient) =>
	useMutation(
		(newVoucher: VoucherDto) =>
			postObject(`${apiRoutes.vouchersUrl}`, newVoucher),
		{
			onSuccess: async () => {
				await qc.invalidateQueries();
			}
		}
	);

export const useDeleteVoucher = (qc: QueryClient) =>
	useMutation(
		(voucherId: string) =>
			deleteObject(`${apiRoutes.vouchersUrl}/${voucherId}`),
		{
			onSuccess: async () => {
				await qc.invalidateQueries();
			}
		}
	);

export const useGetMe = () =>
	useQuery<AxiosResponse<UserDto>, AxiosError>(['get', 'me'], () =>
		getObjects<UserDto>(apiRoutes.meUrl)
	);

export const useGetAllUsers = () =>
	useQuery<AxiosResponse<UserDto[]>, AxiosError>(['list', 'users'], () =>
		getObjects<UserDto[]>(`${apiRoutes.usersUrl}/all`)
	);

export const useDeleteUser = (qc: QueryClient) =>
	useMutation(
		(userId: string) => deleteObject(`${apiRoutes.usersUrl}/${userId}`),
		{
			onSuccess: async () => {
				await qc.invalidateQueries();
			}
		}
	);

export const useSignUp = () =>
	useMutation((login: LoginDto) =>
		postObject<UserDto, LoginDto>(apiRoutes.signupUrl, login)
	);

export const useLogin = () =>
	useMutation((login: LoginDto) =>
		postObject<UserDto, LoginDto>(apiRoutes.loginUrl, login)
	);

export const usePostOrder = (qc: QueryClient) =>
	useMutation(
		(order: OrderUpsertDto) =>
			postObject<string, OrderUpsertDto>(apiRoutes.ordersUrl, order),
		{
			onSuccess: async () => {
				await qc.invalidateQueries();
			}
		}
	);

export const useLogout = (qc: QueryClient) =>
	useMutation(() => postObject(apiRoutes.logoutUrl, null), {
		onSuccess: async () => {
			await qc.invalidateQueries();
		}
	});

export const useUpdateUser = (qc: QueryClient) =>
	useMutation(
		(updatedUser: UserUpdateDto) =>
			putObject(`${apiRoutes.usersUrl}/${updatedUser.id}`, updatedUser),
		{
			onSuccess: async () => {
				await qc.invalidateQueries();
			}
		}
	);
