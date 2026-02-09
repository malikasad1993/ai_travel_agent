import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const CreateTripDetail = mutation({
  args: {
    tripId: v.string(),
    tripDetail: v.any(),
    uid: v.id('UserTable')
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert('TripPlanTable', {
      tripId: args.tripId,
      tripDetail: args.tripDetail,
      uid: args.uid
    })
    return result
  }
})

export const GetUserTrips = query({
  args: {
    uid: v.id('UserTable')
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query('TripPlanTable')
      .filter(q => q.eq(q.field('uid'), args.uid))
      .order('desc')
      .collect()

    return result
  }
})

export const GetTripById = query({
  args: {
    uid: v.id('UserTable'),
    tripid: v.string()
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query('TripPlanTable')
      .filter(q =>
        q.and(
          q.eq(q.field('uid'), args.uid),
          q.eq(q.field('tripId'), args?.tripid)
        )
      )
      .collect()

    return result[0]
  }
})
