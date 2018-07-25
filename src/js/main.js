import Application from './app'
import EventListener from './app/event'

new Application()
    .registerRenderEventListener(EventListener)
    .run('login');