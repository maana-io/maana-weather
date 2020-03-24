import { log, print } from 'io.maana.shared'
import GraphQLDateTime from 'graphql-type-datetime'

import { gql } from 'apollo-server-express'
import weather from 'weather-js'

require('dotenv').config()

const SERVICE_ID = process.env.SERVICE_ID
const SELF = SERVICE_ID || 'io.maana.weather-js'

export const resolver = {
  Query: {
    info: async (_, args, { client }) => {
      let remoteId = SERVICE_ID

      try {
        if (client) {
          const query = gql`
            query info {
              info {
                id
              }
            }
          `
          const {
            data: {
              info: { id }
            }
          } = await client.query({ query })
          remoteId = id
        }
      } catch (e) {
        log(SELF).error(
          `Info Resolver failed with Exception: ${e.message}\n${print.external(
            e.stack
          )}`
        )
      }

      return {
        id: SERVICE_ID,
        name: 'io.maana.template',
        description: `Maana Q Knowledge Service template using ${remoteId}`
      }
    },
    weather: async (_, { search, degreeType }) => {
      return new Promise((resolve, reject) => {
        weather.find({ search, degreeType }, function(err, result) {
          if (err) console.log(err)
          console.log(JSON.stringify(result, null, 2))
          resolve(result)
        })
      })
    }
  }
  // DateTime: GraphQLDateTime
}
