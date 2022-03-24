import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'
import spotifyAPI, { LOGIN_URL } from '../../../lib/spotify'

// Reference: Refresh Token Rotation https://next-auth.js.org/tutorials/refresh-token-rotation
// Reference: TS defined = https://next-auth.js.org/getting-started/typescript

async function refreshAccessToken(token: any) {
  try {
    spotifyAPI.setAccessToken(token.accessToken)
    spotifyAPI.setRefreshToken(token.refreshToken)

    const { body: refreshToken } = await spotifyAPI.refreshAccessToken()
    console.log('refreshToken: ', refreshToken)

    return {
      ...token,
      accessToken: refreshToken.access_token,
      accessTokenExpires: Date.now() + refreshToken.expires_in * 1000, // 1 hour from now = 3600 * 1000 ms return from spotify API.
      refreshToken: refreshToken.refresh_token ?? token.refreshToken, // fallback to the old refresh token if the new one is not returned.
    }
  } catch (error) {
    console.log(error)
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID ?? '',
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET ?? '',
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET ?? '',
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }: any) {
      // Initial sign in.
      if (account && user)
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpiresAt: account.expires_at
            ? account.expires_at * 1000 ?? 3600 * 1000
            : null, // Handle in milliseconds
        }

      // Return previos token if the access token is still valid.
      if (
        token &&
        token.accessTokenExpires &&
        Date.now() < token.accessTokenExpires
      ) {
        return token
      }

      // Access Token expired. Refresh token.
      console.log('Access Token expired. Refreshing token...')
      // @ts-ignore
      return await refreshAccessToken(token)
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.accessToken = token.accessToken // token.access token is HTTP only. Cannot be accessed by client. directly.
      session.user.refreshToken = token.refreshToken
      session.user.username = token.username

      return session
    },
  },
})
