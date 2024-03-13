import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { INewProduct, INewUser, IUpdateProduct, IUser, UserImage } from "@/types";
import { createOrder, createProduct, createReview, createUserAccount, deactivateMyAccount, archiveProduct, getAllUsers, getFilteredProducts, getMyOrders, getOrders, getOrdersBySessionId, getPaginatedProducts, getProducts, getProuctById, getProuctBySlug, getUserById, getUserSession, setProductDiscount, signInAccount, signOutAccount, updateMyAccount, updateMyPassword, updateProduct, updateShippingStatus, verifyAccount, restoreProduct, getArchivedProducts, requestEmailChangeVerificationCode, updateMyEmail } from "../backend-api";
import { PriceRange } from "@/hooks/store";
import { useProductStore } from '@/hooks/store'

// ============================================================
// AUTH QUERIES
// ============================================================
export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user),
        onSuccess: (data) => { },
        onError: (data) => { },
    });
};

export const useVerifyAccount = () => {
    return useMutation({
        mutationFn: (user: { code: string }) => verifyAccount(user),
    });
};

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: { email: string; password: string }) =>
            signInAccount(user),
        onSuccess: (data) => { },
        onError: (data) => { },
    });
};

export const useGetUserSession = () => {
    return useMutation({
        mutationFn: () => getUserSession(),
        onSuccess: (data) => { },
        onError: (data) => { },
    });
};

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount,
    });
};

export const useUpdateMyAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: { firstName: string; lastName: string; photo?: UserImage }) =>
            updateMyAccount(user),
        onError: (error) => { },
        onSuccess: (response) => {
            //@ts-ignore
            const userId = response.data.data.user._id as string;
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
            });
        },
    });
};

export const useRequestEmailChangeVerificationCode = () => {
    return useMutation({
        mutationFn: ({ email }: { email: string }) => requestEmailChangeVerificationCode({ email }),
    });
};

export const useUpdateMyEmail = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: { code: string; newEmail: string }) => updateMyEmail(user),
        onError: (error) => { console.log(error) },
        onSuccess: (response) => {
            if (response.status === 200) {
                //@ts-ignore
                const userId = response.data.data.user._id as string;
                if (userId) {
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
                    });
                }
            } else if (response.status === 400) {
                console.log(response)
            }
        },
    });
};

export const useUpdateMyPassword = () => {
    return useMutation({
        mutationFn: (user: { password: string; passwordConfirm: string; passwordCurrent: string }) =>
            updateMyPassword(user),
    });
};

export const useDeactivateMyAccount = () => {
    return useMutation({ mutationFn: () => deactivateMyAccount() });
};

export const useGetUserById = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
        queryFn: () => getUserById(userId),
        enabled: !!userId,
    });
};

export const useGetAllUsers = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_USER],
        queryFn: () => getAllUsers(),
    });
};

// ============================================================
// PRODUCT QUERIES
// ============================================================
export const useGetProducts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PRODUCTS],
        queryFn: () => getProducts(),
    });
};

export const useGetArchivedProducts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ARCHIVED_PRODUCTS],
        queryFn: () => getArchivedProducts(),
    });
};

export const useGetPaginatedProducts = (page: number, pageSize: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PRODUCTS, page, pageSize],
        queryFn: () => getPaginatedProducts(page, pageSize),
    });
};

export const useGetFilteredProducts = () => {
    const setFilteredProducts = useProductStore((state) => state.setFilteredProducts);
    const setTotalProducts = useProductStore((state) => state.setTotalProducts);

    return useMutation({
        mutationFn: (
            { hideOutOfStock, prices, brands, categories, ratings, page, pageSize, sort }:
                { hideOutOfStock?: boolean, prices?: PriceRange[], brands?: string[], categories?: string[], ratings?: number[], page: number, pageSize: number, sort?: string; }
        ) =>
            getFilteredProducts({ hideOutOfStock, prices, brands, categories, ratings, page, pageSize, sort }),

        onSuccess: (data) => {
            const { totalProducts, products } = data.data;
            setTotalProducts(totalProducts);
            setFilteredProducts(products);
        },
    });
};

export const useGetProductById = (productId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PRODUCT_BY_ID, productId],
        queryFn: () => getProuctById(productId),
        enabled: !!productId,
    });
};

export const useGetProductBySlug = (slug?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PRODUCT_BY_SLUG, slug],
        queryFn: () => getProuctBySlug(slug),
        enabled: !!slug,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product: INewProduct) => createProduct(product),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PRODUCTS],
            });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product: IUpdateProduct) => updateProduct(product),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PRODUCTS],
            });
        },
    });
};

export const useArchiveProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: any) => archiveProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PRODUCTS],
            });
        },
    });
};

export const useRestoreProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product: { id: string }) => restoreProduct(product),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ARCHIVED_PRODUCTS],
            });
        },
    });
};

export const useSetProductDiscount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product: { id: string; discountedPrice?: number; isDiscounted: boolean }) => setProductDiscount(product),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PRODUCTS],
            });
        },
    });
};

// ============================================================
// ORDERS
// ============================================================
export const useGetOrders = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ORDERS],
        queryFn: () => getOrders(),
    });
};

export const useGetOrderBySessionId = (sessionId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ORDER_BY_SESSION_ID, sessionId],
        queryFn: () => getOrdersBySessionId(sessionId),
        enabled: !!sessionId,
    });
};

export const useGetMyOrders = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_MY_ORDERS],
        queryFn: () => getMyOrders(),
    });
};

export const useCreateOrder = () => {
    return useMutation({
        mutationFn: (data: {
            orders: { productId: string; quantity: number }[];
            userId: string;
        }) => createOrder(data),
        onSuccess: (data) => {
            console.log("success", data);
        },
    });
};

export const useUpdateShippingStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (order: { orderId: string; status: string }) =>
            updateShippingStatus(order),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ORDERS],
            });
        },
    });
};

// ============================================================
// REVIEWS
// ============================================================
export const useCreateReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (review: { productId: string; rating: number; title: string; comment: string }) =>
            createReview(review),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PRODUCT_BY_ID, data],
            });
        },
    });
};