import axios from 'axios';
import { httpClient } from '@/services/backendService/httpClient'
import { TokenService } from './tokenService/tokenService'


class AuthenticationError extends Error {
    constructor(errorCode, message) {
        super(message)
        this.name = this.constructor.name
        this.message = message
        this.errorCode = errorCode
    }
}

const UserService = {
    /**
     * Login the user and store the access token to TokenService. 
     * 
     * @returns access_token
     * @throws AuthenticationError 
    **/
    login: async function (userCredentials) {
        try {
            const response = await axios.post(`http://takvaviya.in:8001/Asset/account/login/`, userCredentials)
            if(response.data.token)
            {
                TokenService.saveToken(response.data.token)
                localStorage.setItem('subscription',response.data.subscription)
                localStorage.setItem('usertype',response.data.type)
                localStorage.setItem('username',response.data.email.split('@')[0]) //TODO change entire storing to a store
                return response.data
            }
            else
            {
                throw new AuthenticationError('Login Error')
            }

        } catch (error) {
            throw new AuthenticationError(error.response.status, error.response.data.detail)
        }
    },

    /**
    * Register the user and if successful, login the user. 
    * 
    * @returns newly created user details
    * @throws AuthenticationError 
    **/
    register: async function (newUserData) {
        try {
            const response = await axios.post(`http://takvaviya.in:8001/Asset/account/register/`, newUserData)
            return response.data
        } catch (error) {
            throw new AuthenticationError(error.response.status, error.response.data.detail)
        }
    },

        /**
    * Resets the password by taking in the registered email. 
    **/
   resetPassword: async function (email) {
    try {
        const response = await axios.post(`http://takvaviya.in:8001/Asset/account/reset_password/`, email)
        return response.data
    } catch (error) {
        throw new Error(error.message)
    }
},

    /**
     * Refresh the access token.
    **/
    refreshToken: async function () {
        const refreshToken = TokenService.getRefreshToken()

        const requestData = {
            method: 'post',
            url: "/o/token/",
            data: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            },
            auth: {
                username: process.env.VUE_APP_CLIENT_ID,
                password: process.env.VUE_APP_CLIENT_SECRET
            }
        }

        try {
            const response = await httpClient.customRequest(requestData)

            TokenService.saveToken(response.data.access_token)
            TokenService.saveRefreshToken(response.data.refresh_token)
            // Update the header in httpClient
            httpClient.setHeader()

            return response.data.access_token
        } catch (error) {
            throw new AuthenticationError(error.response.status, error.response.data.detail)
        }

    },

    /**
     * Logout the current user by removing the token from storage. 
     * 
     * Will also remove `Authorization Bearer <token>` header from future requests.
    **/
    logout() {
        // Remove the token and remove Authorization header from Api Service as well 
        TokenService.removeToken()
        //TokenService.removeRefreshToken()
    }
}

export default UserService

export { UserService, AuthenticationError }