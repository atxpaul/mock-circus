import Fastify from 'fastify';
import fs from 'fs';
import yaml from 'js-yaml';
import { faker } from '@faker-js/faker';

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

circusConfig.forEach((entry) => {
    const entries = entry.entries || 10;
    fastify.get(entry.route, (request, reply) => {
        const data = generateData(entry.data, entries);
        reply.send(data);
    });
});

const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Server running at port 3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
