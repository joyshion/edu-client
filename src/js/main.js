import Application from './app'
import EventListener from './app/event'

new Application()
    .registerEventListener(EventListener)
    .run('login');