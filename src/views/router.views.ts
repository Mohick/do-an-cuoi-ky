
import routerGroup from "./group.views"
import { routerTask } from "./task.views"
import { routerUser } from "./user.views"





export function router(app: any) {
    app.get('/', (req: any, res: any) => {
        res.send('index')
    })
    app.use('/api/task', routerTask)
    app.use('/api/user', routerUser)
    app.use('/api/group', routerGroup)
}