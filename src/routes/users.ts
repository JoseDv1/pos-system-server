import { Context, Hono } from "hono";

export const usersRouter = new Hono()

usersRouter.get('/', (ctx) => {
	return ctx.json({ users: [] })
})

usersRouter.post('/', (ctx) => {
	return ctx.json({ user: {} })
})

usersRouter.get('/:id', (ctx: Context) => {
	const id = ctx.req.param('id')
	return ctx.json({ user: { id } })
})
