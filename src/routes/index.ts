import { Router } from 'express'

import aboutPageRoute from './aboutPage'

const routes = Router()

routes.use(aboutPageRoute)

export default routes
