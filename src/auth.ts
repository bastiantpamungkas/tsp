import NextAuth from "next-auth"

// import Apple from "next-auth/providers/apple"
// import Atlassian from "next-auth/providers/atlassian"
// import Auth0 from "next-auth/providers/auth0"
// import Authentik from "next-auth/providers/authentik"
// import AzureAD from "next-auth/providers/azure-ad"
// import AzureB2C from "next-auth/providers/azure-ad-b2c"
// import Battlenet from "next-auth/providers/battlenet"
// import Box from "next-auth/providers/box"
// import BoxyHQSAML from "next-auth/providers/boxyhq-saml"
// import Bungie from "next-auth/providers/bungie"
// import Cognito from "next-auth/providers/cognito"
// import Coinbase from "next-auth/providers/coinbase"
// import Discord from "next-auth/providers/discord"
// import Dropbox from "next-auth/providers/dropbox"
// import DuendeIDS6 from "next-auth/providers/duende-identity-server6"
// import Eveonline from "next-auth/providers/eveonline"
// import Facebook from "next-auth/providers/facebook"
// import Faceit from "next-auth/providers/faceit"
// import FortyTwoSchool from "next-auth/providers/42-school"
// import Foursquare from "next-auth/providers/foursquare"
// import Freshbooks from "next-auth/providers/freshbooks"
// import Fusionauth from "next-auth/providers/fusionauth"
// import GitHub from "next-auth/providers/github"
// import Gitlab from "next-auth/providers/gitlab"
import Google from "next-auth/providers/google"
// import Hubspot from "next-auth/providers/hubspot"
// import Instagram from "next-auth/providers/instagram"
// import Kakao from "next-auth/providers/kakao"
// import Keycloak from "next-auth/providers/keycloak"
// import Line from "next-auth/providers/line"
// import LinkedIn from "next-auth/providers/linkedin"
// import Mailchimp from "next-auth/providers/mailchimp"
// import Mailru from "next-auth/providers/mailru"
// import Medium from "next-auth/providers/medium"
// import Naver from "next-auth/providers/naver"
// import Netlify from "next-auth/providers/netlify"
// import Okta from "next-auth/providers/okta"
// import Onelogin from "next-auth/providers/onelogin"
// import Osso from "next-auth/providers/osso"
// import Osu from "next-auth/providers/osu"
// import Passage from "next-auth/providers/passage"
// import Patreon from "next-auth/providers/patreon"
// import Pinterest from "next-auth/providers/pinterest"
// import Pipedrive from "next-auth/providers/pipedrive"
// import Reddit from "next-auth/providers/reddit"
// import Salesforce from "next-auth/providers/salesforce"
// import Slack from "next-auth/providers/slack"
// import Spotify from "next-auth/providers/spotify"
// import Strava from "next-auth/providers/strava"
// import Todoist from "next-auth/providers/todoist"
// import Trakt from "next-auth/providers/trakt"
// import Twitch from "next-auth/providers/twitch"
// import Twitter from "next-auth/providers/twitter"
// import UnitedEffects from "next-auth/providers/united-effects"
// import Vk from "next-auth/providers/vk"
// import Wikimedia from "next-auth/providers/wikimedia"
// import Wordpress from "next-auth/providers/wordpress"
// import WorkOS from "next-auth/providers/workos"
// import Yandex from "next-auth/providers/yandex"
// import Zitadel from "next-auth/providers/zitadel"
// import Zoho from "next-auth/providers/zoho"
// import Zoom from "next-auth/providers/zoom"
import Sendgrid from "next-auth/providers/sendgrid"
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from '@/src/lib/prismaClient'
import template_email from '@/src/email/forgot-password.template'

import type { NextAuthConfig } from "next-auth"

export const config = {
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  session: {
    // Choose how you want to save the user session.
    // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
    // If you use an `adapter` however, we default it to `"database"` instead.
    // You can still force a JWT session by explicitly defining `"jwt"`.
    // When using `"database"`, the session cookie will only contain a `sessionToken` value,
    // which is used to look up the session in the database.
    strategy: "jwt"  
    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days
  
    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
    
    // The session token is usually either a random UUID or string, however if you
    // need a more customized session token string, you can define your own generate function.
    // generateSessionToken: () => {
    //   return randomUUID?.() ?? randomBytes(32).toString("hex")
    // }
  },  
  adapter: PrismaAdapter(prisma),
  providers: [
    // Apple,
    // Atlassian,
    // Auth0,
    // Authentik,
    // AzureAD,
    // AzureB2C,
    // Battlenet,
    // Box,
    // BoxyHQSAML,
    // Bungie,
    // Cognito,
    // Coinbase,
    // Discord,
    // Dropbox,
    // DuendeIDS6,
    // Eveonline,
    // Facebook,
    // Faceit,
    // FortyTwoSchool,
    // Foursquare,
    // Freshbooks,
    // Fusionauth,
    // GitHub,
    // Gitlab,
    Google,
    // Hubspot,
    // Instagram,
    // Kakao,
    // Keycloak,
    // Line,
    // LinkedIn,
    // Mailchimp,
    // Mailru,
    // Medium,
    // Naver,
    // Netlify,
    // Okta,
    // Onelogin,
    // Osso,
    // Osu,
    // Passage,
    // Patreon,
    // Pinterest,
    // Pipedrive,
    // Reddit,
    // Salesforce,
    // Slack,
    // Spotify,
    // Strava,
    // Todoist,
    // Trakt,
    // Twitch,
    // Twitter,
    // UnitedEffects,
    // Vk,
    // Wikimedia,
    // Wordpress,
    // WorkOS,
    // Yandex,
    // Zitadel,
    // Zoho,
    // Zoom,
    Sendgrid({
      name: 'Email',
      async sendVerificationRequest(params: any) {
        const { identifier, url, provider, theme } = params
        const { host } = new URL(url)

        if (identifier) {
          const user_data = await prisma.user.findFirst({
            where: {
              email: identifier,
            },
          });
          if (user_data) {
            if (user_data.hashed_email_verify) {
              // throw new Error(`Email(s) (${identifier}) not active`)
            } else {
              let formdata = <any>{}
              formdata.from = { email : process.env.MAIL_FROM_ADDRESS, name: 'info ' + process.env.MAIL_FROM_NAME }
              formdata.to = [{'email' : identifier}]
              formdata.subject = `Sign in to ${process.env.MAIL_FROM_NAME}`
              formdata.html = template_email(user_data, url)

              try {
                let response = await fetch(<string>process.env.MAILTRAP_DOMAIN, {
                  method: 'POST',
                  headers: {
                    'Authorization': 'Bearer ' + process.env.MAILTRAP_TOKEN,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(formdata)
                })

                const data = await response.json();
              } catch(err) {
                console.log(err)
              }
            }
          } else {
            // throw new Error(`Email(s) (${identifier}) could not be found`)
          }
        } else {
          // throw new Error(`Email(s) required`)
        }
      }
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password", placeholder: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        try {
          const responseSignin = await fetch(process.env.AUTH_URL + '/api/auth/signin', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password
            }),
          })
          const return_data = await responseSignin.json()
          if (return_data && return_data.user && return_data.user.id) {
            return return_data.user; 
          } else {
            return null
          }
        } catch (err) {
          return null
        }
      }
    }),
  ],
  basePath: "/auth",
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      if (pathname === "/admin/dashboard") return !!auth
      if (pathname === "/admin/permissions") return !!auth
      if (pathname === "/admin/roles") return !!auth
      if (pathname === "/admin/users") return !!auth
      if (pathname === "/admin/profile") return !!auth
      return true
    },
    jwt({ token, trigger, session }) {
      if (trigger === "update") {
        token.name = session.user.name
        token.email = session.user.email
        token.image = session.user.image
      }
      if (token && token.sub) {
        token.id = <string>token.sub
      }
      return token
    },
    async session({ session, user, token }) { 
      if (token && token.sub) {
          session.user.id = token.sub
      }
      return session
    }
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
