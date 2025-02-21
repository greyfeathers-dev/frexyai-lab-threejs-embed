const App = require('./src/app');

const app = new App();
app.initialize().catch(console.error);
