const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Raw event:', JSON.stringify(event, null, 2));
    
    try {
        // API Gateway sends the body as a string - parse it properly
        let body;
        try {
            body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        } catch (parseError) {
            console.error('Body parse error:', parseError);
            console.error('Raw body received:', event.body);
            throw new Error('Invalid JSON format in request body');
        }

        console.log('Parsed body:', JSON.stringify(body, null, 2));
        
        const params = {
            TableName: process.env.EVENTS_TABLE,
            Item: {
                eventId: AWS.util.uuid.v4(),
                title: body.title || 'No Title',
                description: body.description || '',
                date: body.date || new Date().toISOString(),
                location: body.location || '',
                createdAt: new Date().toISOString()
            }
        };

        console.log('DynamoDB params:', JSON.stringify(params, null, 2));
        console.log('Table name from env:', process.env.EVENTS_TABLE);

        const result = await dynamoDb.put(params).promise();
        console.log('DynamoDB success:', JSON.stringify(result, null, 2));
        
        return {
            statusCode: 201,
            headers: { 
                'Content-Type': 'application/json', 
                'Access-Control-Allow-Origin': '*' 
            },
            body: JSON.stringify(params.Item)
        };
    } catch (error) {
        console.error('FULL ERROR:', error);
        console.error('ERROR STACK:', error.stack);
        
        return {
            statusCode: 500,
            headers: { 
                'Content-Type': 'application/json', 
                'Access-Control-Allow-Origin': '*' 
            },
            body: JSON.stringify({ 
                error: "Failed to create event",
                message: error.message
            })
        };
    }
};