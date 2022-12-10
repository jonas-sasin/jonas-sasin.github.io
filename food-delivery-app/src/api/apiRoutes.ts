const baseUrl = 'https://20.250.125.45:443/api';

export const apiRoutes = {
	reviewUrl: `${baseUrl}/reviews`,
	restaurantsUrl: `${baseUrl}/restaurants`,
	restaurantCategoriesUrl: `${baseUrl}/restaurants/categories`,
	ordersUrl: `${baseUrl}/orders`,
	allOrdersUrl: `${baseUrl}/orders/all`,
	itemsUrl: `${baseUrl}/items`,
	itemCategoriesUrl: `${baseUrl}/items/categories`,
	meUrl: `${baseUrl}/auth/me`,
	loginUrl: `${baseUrl}/auth/login`,
	logoutUrl: `${baseUrl}/auth/logout`,
	signupUrl: `${baseUrl}/auth/register`,
	usersUrl: `${baseUrl}/users`,
	addressesUrl: `${baseUrl}/addresses`,
	cardsUrl: `${baseUrl}/cards`,
	vouchersUrl: `${baseUrl}/vouchers`
};
