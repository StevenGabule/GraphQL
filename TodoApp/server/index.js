require('dotenv').config();
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const express = require('express');
const connectDB = require('./db')

const app = express();
const port = process.env.PORT || 9000;

connectDB();
app.use(cors());

app.use('/graphql', graphqlHTTP({
	schema,
	graphiql: process.env.NODE_ENV === 'development'
}))
app.listen(port, console.log(`server running on port ${port}`));