import Fastify from 'fastify';
import fs from 'fs';
import yaml from 'js-yaml';
import { faker } from '@faker-js/faker';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

const fastify = Fastify();

const circusConfig = yaml.load(fs.readFileSync('circus.yml', 'utf8'));

const generateData = (schema, entries = 10) => {
    return Array.from({ length: entries }, () => {
        const generatedItem = {};
        schema.forEach((item) => {
            Object.entries(item).forEach(([key, fakerPath]) => {
                const fakerFunction = fakerPath
                    .split('.')
                    .reduce((acc, curr) => acc[curr], faker);
                generatedItem[key] = fakerFunction();
            });
        });
        return generatedItem;
    });
};

fastify.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Dynamic API',
            description: 'Generated API endpoints from circus.yml',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
});

fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: true,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
});

fastify.after(() => {
    circusConfig.forEach((entry) => {
        const entries = entry.entries || 10;

        const schema = {
            description: `Dynamically generated endpoint for ${entry.route}`,
            tags: ['Dynamic Endpoints'],
            response: {
                200: {
                    description: `A list of dynamically generated data`,
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: entry.data.reduce((acc, item) => {
                            Object.keys(item).forEach((key) => {
                                acc[key] = { type: 'string' };
                            });
                            return acc;
                        }, {}),
                    },
                },
            },
        };

        console.log(
            `Registering route: ${entry.route} with schema:`,
            JSON.stringify(schema, null, 2)
        );

        fastify.get(entry.route, { schema }, (request, reply) => {
            const data = generateData(entry.data, entries);
            reply.send(data);
        });
    });
});

const start = async () => {
    try {
        await fastify.ready();
        console.log(fastify.printRoutes());
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Server running at http://localhost:3000');
        console.log('Swagger UI available at http://localhost:3000/docs');
    } catch (err) {
        console.error('Error starting the server:', err);
        process.exit(1);
    }
};

start();
