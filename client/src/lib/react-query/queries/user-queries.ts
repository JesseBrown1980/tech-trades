import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKeys";
import { INewUser, UserImage } from "@/types";
import {
    createUserAccount,
    verifyAccount,
    signInAccount,
    magicLinkSignIn,
    sendMagicLinkToken,
    getUserSession,
    signOutAccount,
    updateMyAccount,
    requestEmailChangeVerificationCode,
    requestForgotPasswordVerificationCode,
    verifyPasswordResetVerificationDoe,
    resetForgottenPassword,
    updateMyEmail,
    updateMyPassword,
    deactivateMyAccount,
    getUserById,
    getAllUsers,
} from "../../backend-api/users";

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

export const useMagicLinkSignIn = () => {
    return useMutation({
        mutationFn: (user: { email: string }) => magicLinkSignIn(user),
        onSuccess: (data) => { },
        onError: (data) => { },
    });
};

export const useSendMagicLinkToken = () => {
    return useMutation({
        mutationFn: ({ token }: { token: string }) => sendMagicLinkToken({ token }),
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
        mutationFn: (user: {
            firstName: string;
            lastName: string;
            photo?: UserImage;
        }) => updateMyAccount(user),
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
        mutationFn: ({ email }: { email: string }) =>
            requestEmailChangeVerificationCode({ email }),
    });
};

export const useRequestForgotPasswordVerificationCode = () => {
    return useMutation({
        mutationFn: (email: { email: string }) =>
            requestForgotPasswordVerificationCode(email),
    });
};

export const useVerifyPasswordResetVerificationDoe = () => {
    return useMutation({
        mutationFn: (code: { code: string }) =>
            verifyPasswordResetVerificationDoe(code),
    });
};

export const useResetForgottenPassword = () => {
    return useMutation({
        mutationFn: (user: {
            password: string;
            confirmPassword: string;
            email: string;
            code: string;
        }) => resetForgottenPassword(user),
    });
};

export const useUpdateMyEmail = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: { code: string; newEmail: string }) =>
            updateMyEmail(user),
        onError: (error) => {
            console.log(error);
        },
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
                console.log(response);
            }
        },
    });
};

export const useUpdateMyPassword = () => {
    return useMutation({
        mutationFn: (user: {
            password: string;
            passwordConfirm: string;
            passwordCurrent: string;
        }) => updateMyPassword(user),
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
